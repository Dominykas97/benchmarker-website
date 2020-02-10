const restClient = require('./rest.js');
const rest = new restClient();
const fsPromises = require('fs').promises;
const express = require('express');
const request = require('request');
const app = express();
app.use(express.json());

// const port = process.env.PORT || 5000;
const port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '5000');
let ip = process.env.OPENSHIFT_NODEJS_IP;
if (typeof ip === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    ip = "127.0.0.1";
}

let jobsQueue = [];
let jobsServicesDeploymentConfigs = {};
let deletedQueueNames = new Set();

async function checkRunningJob() {
    let jobs = await rest.getJobs();
    let runningJobs = getRunningJobs(jobs);
    console.log("Checking running jobs:");
    console.log(runningJobs);
    if ((typeof runningJobs === 'undefined' || runningJobs.length === 0) && jobsQueue.length > 0) {
        let jobParameters = jobsQueue.shift();
        while (deletedQueueNames.has(jobParameters.jobName)) {
            jobParameters = jobsQueue.shift();
        }
        console.log("Checking parameters:");
        console.log(jobParameters);
        rest.patchConfigMap(jobParameters);
        rest.createNewJob(jobParameters);
    }
}

setInterval(checkRunningJob, 10000);

// console.log that your server is up and running
app.listen(port, () => console.log(`${ip}:${port}`));

app.get('/', (req, res) => {
    res.redirect('/express_backend');
});

// create a GET routeL
app.get('/express_backend', (req, res) => {
    res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'});
});

app.post('/new_job', async (req, res) => {
    let jobs = await rest.getJobs();
    let runningJobs = getRunningJobs(jobs);
    console.log("running jobs:");
    console.log(runningJobs);

    req.body.jobName = req.body.jobType + req.body.jobName;
    if (typeof runningJobs === 'undefined' || runningJobs.length === 0) {

        let serviceJobManagerName = getServiceJobManagerName(req.body.jobName);//req.body.jobName.replace("job-", "srv-jobmanager-");
        let serviceTaskManagerName = getServiceTaskManagerName(req.body.jobName);//req.body.jobName.replace("job-", "srv-taskmanager-");
        console.log(serviceJobManagerName);
        console.log(serviceTaskManagerName);

        jobsServicesDeploymentConfigs[req.body.jobName] = {
            "jobName": req.body.jobName,
            "serviceJobManagerName": serviceJobManagerName,
            "serviceTaskManagerName": serviceTaskManagerName,
            "deploymentConfigJobManagerName": getDeploymentConfigJobManagerName(req.body.jobName),//deploymentConfigJobManagerName,
            "deploymentConfigTaskManagerName": getDeploymentConfigTaskManagerName(req.body.jobName)//deploymentConfigTaskManagerName
        };

        console.log("/new_job jobsServicesDeploymentConfigs:");
        console.log(jobsServicesDeploymentConfigs);
        await rest.patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName);
        await rest.patchFlinkConfigMap(serviceJobManagerName);
        await rest.patchConfigMap(req.body);
        await rest.createTaskManagerService(req.body, serviceTaskManagerName);
        await rest.createJobManagerService(req.body, serviceJobManagerName);
        await rest.createStartImageStream(getImageStreamStartName(req.body.jobName));
        await rest.createStartBuildConfig(serviceJobManagerName,getBuildConfigStartName(req.body.jobName), getImageStreamStartName(req.body.jobName));
        setTimeout(function () {
            rest.buildStartBuildConfig(getBuildConfigStartName(req.body.jobName));
        }, 5000);
        setTimeout(function () {
            rest.deployJobManager(req.body, serviceJobManagerName, getDeploymentConfigJobManagerName(req.body.jobName));
        }, 30000);
        setTimeout(function () {
            rest.deployTaskManager(req.body, serviceJobManagerName, getDeploymentConfigTaskManagerName(req.body.jobName));
        }, 40000);
        setTimeout(function () {
            request.post(
                'http://prom-2262804sproject.ida.dcs.gla.ac.uk/-/reload',
                {json: {}},
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(body);
                    }
                }
            );
        }, 50000);
        setTimeout(function () {
            rest.createNewJob(req.body, serviceJobManagerName, getImageStreamStartName(req.body.jobName));
        }, 60000);

        res.redirect('/new');
    } else {
        jobsQueue.push(req.body);
        // res.send({alerts:'New test added to a queue.'});
        console.log("Jobs queue:");
        console.log(jobsQueue);
    }
});

app.post('/remove_job', (req, res) => {
    console.log("app.post removing name:");
    console.log(req.body.name);
    rest.removeJob(req.body.name);
    let a = jobsServicesDeploymentConfigs[req.body.name];
    if (typeof a !== 'undefined') {
        rest.removeService(a.serviceTaskManagerName);
        rest.removeService(a.serviceJobManagerName);
        rest.removeDeploymentConfig(a.deploymentConfigTaskManagerName);
        rest.removeDeploymentConfig(a.deploymentConfigJobManagerName);
        delete jobsServicesDeploymentConfigs[req.body.name];
    }
    // res.redirect('/new');
});

app.post('/remove_from_queue', (req, res) => {
    console.log("app.post removing name from queue:");
    console.log(req.body.name);
    deletedQueueNames.add(req.body.name);
    console.log(deletedQueueNames);
    // removeJob(req.body.name);
    // res.redirect('/new');
});

app.get('/running_jobs', async (req, res) => {
    let jobs = await rest.getJobs();
    // .then(jobs => {
    console.log(jobs);
    let runningJobs = getRunningJobs(jobs);
    let queueNames = getQueueNames();
    res.send({
        data: jobs,
        runningJobs: runningJobs,
        queueNames: queueNames,
        deletedQueueNames: deletedQueueNames
    });
    // })
});

app.get('/completed_jobs', async (req, res) => {
    let jobItems = await rest.getJobs();
    // .then(jobItems => {
    // console.log(jobs);
    let jobsNames = [];
    let podsNames = {};
    let jobs = jobItems.body.items;
    let podsJSON = await fsPromises.readFile('/nfs/pods.json');
    let knownPodsNames = JSON.parse(podsJSON.toString());
    console.log("Pod names from JSON");
    console.log(knownPodsNames);
    for (let job in jobs) {
        if (jobs.hasOwnProperty(job)) {
            if (jobs[job].status.succeeded === 1) {
                jobsNames.push(jobs[job].metadata.name);
                let deploymentConfigTaskManagerName = getDeploymentConfigTaskManagerName(jobs[job].metadata.name);
                let deploymentConfigJobManagerName = getDeploymentConfigJobManagerName(jobs[job].metadata.name);
                let serviceTaskManagerName = getServiceTaskManagerName(jobs[job].metadata.name);
                let serviceJobManagerName = getServiceJobManagerName(jobs[job].metadata.name);
                let podTaskManagerName;
                let podJobManagerName;
                if (jobs[job].metadata.name in knownPodsNames) {
                    podTaskManagerName = knownPodsNames[jobs[job].metadata.name];
                } else {
                    podTaskManagerName = await rest.getPodName(deploymentConfigTaskManagerName);//completedJob.deploymentConfigTaskManagerName);
                    podJobManagerName = await rest.getPodName(deploymentConfigJobManagerName);//completedJob.deploymentConfigTaskManagerName);
                    knownPodsNames[jobs[job].metadata.name] = podTaskManagerName;
                    rest.removeService(serviceTaskManagerName);
                    rest.removeService(serviceJobManagerName);
                    // removeReplicationController(deploymentConfigTaskManagerName);
                    // removeReplicationController(deploymentConfigJobManagerName);
                    rest.removeDeploymentConfig(deploymentConfigTaskManagerName);
                    rest.removeDeploymentConfig(deploymentConfigJobManagerName);
                    //.then(podTaskManagerName => {
                }
                console.log(jobs[job].metadata.name);
                console.log(deploymentConfigTaskManagerName);
                console.log("POD NAME");
                console.log(podTaskManagerName);
                podsNames[jobs[job].metadata.name] = podTaskManagerName;
                console.log(podsNames);

                delete jobsServicesDeploymentConfigs[jobs[job].metadata.name];
                // }
            }
        }
    }
    console.log("PODS NAMESSS");
    console.log(podsNames);
    console.log("KNOWN PODS NAMESSS");
    console.log(knownPodsNames);
    await fsPromises.writeFile('/nfs/pods.json', JSON.stringify(knownPodsNames));

    res.send({data: jobs, jobsNames: jobsNames, podsNames: podsNames});

});

function getQueueNames() {
    let jobsQueueNames = [];
    for (let name in jobsQueue) {
        if (jobsQueue.hasOwnProperty(name) && !deletedQueueNames.has(jobsQueue[name].jobName)) {
            console.log("Adding to queue:");
            console.log(jobsQueue[name].jobName);
            console.log(deletedQueueNames);
            jobsQueueNames.push(jobsQueue[name].jobName);
        }
    }
    return jobsQueueNames;
}

function getRunningJobs(jobs) {
    let jobNames = [];
    let runningJobs = [];
    for (let job in jobs.body.items) {
        if (jobs.body.items.hasOwnProperty(job)) {
            let jobName = jobs.body.items[job].metadata.name;
            jobNames.push(jobName);
            if (jobs.body.items[job].status.succeeded !== 1) {
                runningJobs.push(jobName);
            }
        }
    }

    for (let job in jobsServicesDeploymentConfigs) {
        if (!jobNames.includes(job)) {
            runningJobs.push(job);
        }
    }
    console.log("Running jobs: ");
    console.log(runningJobs);
    return runningJobs;
}

function getBuildConfigStartName(jobName) {
    // job-appsimulator-flinksim-p1
//    "bc-appsimulator-start
    let buildConfigName = jobName.replace("job-", "bc-");
    return buildConfigName.replace("appsimulator-flinksim-", "appsimulator-start-");
}

function getImageStreamStartName(jobName) {
    // job-appsimulator-flinksim-p1
// "is-appsimulator-start:v1"
    let buildConfigName = jobName.replace("job-", "is-");
    return buildConfigName.replace("appsimulator-flinksim-", "appsimulator-start-");
}

function getDeploymentConfigJobManagerName(jobName) {
    let deploymentConfigName = jobName.replace("job-", "dc-");
    return deploymentConfigName.replace("-flinksim-", "-flinksim-jobmanager-");
}

function getDeploymentConfigTaskManagerName(jobName) {
    let deploymentConfigName = jobName.replace("job-", "dc-");
    return deploymentConfigName.replace("-flinksim-", "-flinksim-taskmanager-");
}

function getServiceTaskManagerName(jobName) {
    return jobName.replace("job-", "srv-taskmanager-");
}

function getServiceJobManagerName(jobName) {
    return jobName.replace("job-", "srv-jobmanager-");
}

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

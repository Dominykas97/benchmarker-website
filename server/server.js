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
let lastRunningJobName = null;

let lastCompletedJobName = null;

async function readPodsFromFile() {
    let podsJSON = await fsPromises.readFile('/nfs/pods.json');
    // let knownPodsNames;
    // if (podsJSON == null) {
    //     knownPodsNames = null;
    // } else {
    //     knownPodsNames = JSON.parse(podsJSON.toString());
    // }
    return JSON.parse(podsJSON.toString());
}

async function checkRunningJob() {
    let jobs = await rest.getJobs();
    let runningJobs = getRunningJobs(jobs);
    console.log("Checking running jobs:");
    console.log(runningJobs);
    console.log("Last completed job:");
    console.log(lastCompletedJobName);

    if (lastCompletedJobName != null) {
        // rest.removeJob(lastRunningJobName);
        let knownPodsNames = await readPodsFromFile();
        let jobItems = await rest.getJob(lastCompletedJobName);
        let job = jobItems.body;
        console.log("Last completed job body:");
        console.log(job);
        // console.log(job.status);
        // console.log(job.status.succeeded);
        if (!(lastCompletedJobName in knownPodsNames)) {//&& jobs.hasOwnProperty(lastCompletedJobName)
            if (job.status.succeeded === 1) {
                let lastCompletedJobPodName = await rest.getPodName(getDeploymentConfigTaskManagerName(lastCompletedJobName));
                console.log("lastCompletedJobPodName:");
                console.log(lastCompletedJobPodName);
                knownPodsNames[lastCompletedJobName] = lastCompletedJobPodName;
                await fsPromises.writeFile('/nfs/pods.json', JSON.stringify(knownPodsNames));
                await removeJobDependencies(lastCompletedJobName);
                lastCompletedJobName = null;
            }
        }
    }

    // if (await rest.hasJobSucceeded(lastRunningJobName)) {
    //     lastCompletedJobName = lastRunningJobName;
    //     lastRunningJobName = null;
    // }

    if ((typeof runningJobs === 'undefined' || runningJobs.length === 0) && jobsQueue.length > 0) {

        let jobParameters = jobsQueue.shift();
        while (deletedQueueNames.has(jobParameters.jobName)) {
            jobParameters = jobsQueue.shift();
        }
        console.log("Checking parameters:");
        console.log(jobParameters);
        await prepareAndRunNewJob({"body": jobParameters});
    }
}

setInterval(checkRunningJob, 10000);

// console.log that your server is up and running
app.listen(port, () => console.log(`${ip}:${port}`));

app.get('/', (req, res) => {
    res.redirect('/express_backend');
});

// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'});
});

async function prepareAndRunNewJob(req) {
    let jobName = req.body.jobName;
    lastCompletedJobName = lastRunningJobName;
    lastRunningJobName = jobName;
    let serviceJobManagerName = getServiceJobManagerName(jobName);//req.body.jobName.replace("job-", "srv-jobmanager-");
    let serviceTaskManagerName = getServiceTaskManagerName(jobName);//req.body.jobName.replace("job-", "srv-taskmanager-");
    let imageStreamStartName = getImageStreamStartName(jobName);
    let buildConfigStartName = getBuildConfigStartName(jobName);
    let deploymentConfigJobManagerName = getDeploymentConfigJobManagerName(jobName);
    let deploymentConfigTaskManagerName = getDeploymentConfigTaskManagerName(jobName);

    jobsServicesDeploymentConfigs[jobName] = {
        "jobName": jobName,
        "serviceJobManagerName": serviceJobManagerName,
        "serviceTaskManagerName": serviceTaskManagerName,
        "deploymentConfigJobManagerName": deploymentConfigJobManagerName,//deploymentConfigJobManagerName,
        "deploymentConfigTaskManagerName": deploymentConfigTaskManagerName//deploymentConfigTaskManagerName
    };
    console.log("/new_job jobsServicesDeploymentConfigs:");
    console.log(jobsServicesDeploymentConfigs);
    await rest.patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName);
    await rest.patchFlinkConfigMap(serviceJobManagerName);
    await rest.patchComponentsConfigMap(req.body);
    await rest.createTaskManagerService(serviceTaskManagerName);
    await rest.createJobManagerService(serviceJobManagerName);
    await rest.createStartImageStream(imageStreamStartName);
    await rest.createStartBuildConfig(serviceJobManagerName, buildConfigStartName, imageStreamStartName);
    setTimeout(function () {
        rest.buildStartBuildConfig(buildConfigStartName);
    }, 5000);
    setTimeout(function () {
        rest.deployJobManager(serviceJobManagerName, deploymentConfigJobManagerName);
    }, 20000);
    setTimeout(function () {
        rest.deployTaskManager(serviceJobManagerName, deploymentConfigTaskManagerName);
    }, 30000);
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
    }, 40000);
    setTimeout(function () {
        rest.createNewJob(jobName, serviceJobManagerName, imageStreamStartName);
    }, 50000);
}

app.post('/new_job', async (req, res) => {
    let jobs = await rest.getJobs();
    let runningJobs = getRunningJobs(jobs);
    console.log("running jobs:");
    console.log(runningJobs);
    if(req.body.jobType === "job-appsimulator-flinksim-"){
        req.body.jobName = req.body.jobType + req.body.jobName;
        if (typeof runningJobs === 'undefined' || runningJobs.length === 0) {
            await prepareAndRunNewJob(req);

            res.redirect('/new');
        } else {
            jobsQueue.push(req.body);
            console.log("Jobs queue:");
            console.log(jobsQueue);
        }
    }
    if(req.body.jobType === "job-vbcar-"){
        let jobName = req.body.jobType + req.body.vbCarJobName;
        await rest.createNewVbCarJob(jobName)
    }
});

async function removeJobDependencies(jobName) {
    await rest.removeService(getServiceTaskManagerName(jobName));
    await rest.removeService(getServiceJobManagerName(jobName));
    await rest.removeDeploymentConfig(getDeploymentConfigTaskManagerName(jobName));
    await rest.removeDeploymentConfig(getDeploymentConfigJobManagerName(jobName));
    await rest.removeStartBuildConfig(getBuildConfigStartName(jobName));
    await rest.removeStartImageStream(getImageStreamStartName(jobName));
}

app.post('/remove_job', (req, res) => {
    console.log("app.post removing name:");
    let jobName = req.body.name;
    console.log(jobName);
    lastRunningJobName = null;
    rest.removeJob(jobName);
    let jobParameters = jobsServicesDeploymentConfigs[jobName];
    if (typeof jobParameters !== 'undefined') {
        removeJobDependencies(jobName);
        delete jobsServicesDeploymentConfigs[jobName];
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
    console.log(jobs);
    let runningJobs = getRunningJobs(jobs);
    let queueNames = getQueueNames();
    res.send({
        data: jobs,
        runningJobs: runningJobs,
        queueNames: queueNames,
        deletedQueueNames: deletedQueueNames
    });
});

app.get('/completed_jobs', async (req, res) => {
    let jobItems = await rest.getJobs();
    let jobsNames = [];
    let podsNames = {};
    let jobs = jobItems.body.items;
    // let podsJSON = await fsPromises.readFile('/nfs/pods.json');
    let knownPodsNames = await readPodsFromFile();//JSON.parse(podsJSON.toString());
    console.log("Pod names from JSON");
    console.log(knownPodsNames);
    for (let job in jobs) {
        if (jobs.hasOwnProperty(job)) {
            if (jobs[job].status.succeeded === 1) {
                let jobName = jobs[job].metadata.name;
                jobsNames.push(jobName);
                let deploymentConfigTaskManagerName = getDeploymentConfigTaskManagerName(jobName);
                let deploymentConfigJobManagerName = getDeploymentConfigJobManagerName(jobName);
                // let serviceTaskManagerName = getServiceTaskManagerName(jobName);
                // let serviceJobManagerName = getServiceJobManagerName(jobName);
                let podTaskManagerName;
                let podJobManagerName;
                if (jobName in knownPodsNames) {
                    podTaskManagerName = knownPodsNames[jobName];
                } else {
                    podTaskManagerName = await rest.getPodName(deploymentConfigTaskManagerName);//completedJob.deploymentConfigTaskManagerName);
                    podJobManagerName = await rest.getPodName(deploymentConfigJobManagerName);//completedJob.deploymentConfigTaskManagerName);
                    knownPodsNames[jobName] = podTaskManagerName;
                    removeJobDependencies(jobName);
                }
                console.log(jobName);
                console.log(deploymentConfigTaskManagerName);
                console.log("POD NAME");
                console.log(podTaskManagerName);
                podsNames[jobName] = podTaskManagerName;
                console.log(podsNames);

                delete jobsServicesDeploymentConfigs[jobName];
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
    let buildConfigName = jobName.replace("job-", "bc-");
    return buildConfigName.replace("appsimulator-flinksim-", "appsimulator-start-");
}

function getImageStreamStartName(jobName) {
    let imageStreamName = jobName.replace("job-", "is-");
    return imageStreamName.replace("appsimulator-flinksim-", "appsimulator-start-");
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

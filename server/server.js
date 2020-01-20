const express = require('express');
const app = express();

app.use(express.json());

const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
const projectName = '2262804sproject';
const settings = {};

settings.config = {
    url: 'https://idagpu-head.dcs.gla.ac.uk:8443',
    // url: 'https://console.ida.dcs.gla.ac.uk',
    auth: {
        username: '2262804s',
        password: 'bench12356'
    },
    insecureSkipTlsVerify: true
};


// const port = process.env.PORT || 5000;
var port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '5000');
var ip = process.env.OPENSHIFT_NODEJS_IP;
if (typeof ip === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    ip = "127.0.0.1";
}

let jobsQueue = [];
function checkRunningJob(){
    getJobs()
        .then(jobs => {
            // console.log(jobs);
            let runningJobs = getRunningJobs(jobs);
            console.log("Checking running jobs:");
            console.log(runningJobs);
            if (typeof runningJobs === 'undefined' || runningJobs.length === 0) {
                let jobParameters = jobsQueue.shift();
                console.log("Checking parameters:");
                console.log(jobParameters);
                createNewJob(jobParameters);
                // res.redirect('/new');
            }
        });
}
setInterval(checkRunningJob,10000);

// console.log that your server is up and running
app.listen(port, () => console.log(`${ip}:${port}`));

app.get('/', (req, res) => {
    res.redirect('/express_backend');
});
// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'});
});

app.post('/new_job', (req, res) => {
    // console.log(req);
    getJobs()
        .then(jobs => {
            // console.log(jobs);
            let runningJobs = getRunningJobs(jobs);
            console.log("running jobs:");
            console.log(runningJobs);
            if (typeof runningJobs === 'undefined' || runningJobs.length === 0) {
                createNewJob(req.body);
                res.redirect('/new');
            } else {
                jobsQueue.push(req.body);
                console.log("Jobs queue:");
                console.log(jobsQueue);
            }
        });
});

app.post('/remove_job', (req, res) => {
    removeJob();
    res.redirect('/new');
});

app.get('/running_jobs', (req, res) => {
    getJobs()
        .then(jobs => {
            console.log(jobs);
            let runningJobs = getRunningJobs(jobs);
            res.send({data:jobs, runningJobs:runningJobs, queueJobs: jobsQueue});
        })
});

app.get('/completed_jobs', (req, res) => {
    getJobs()
        .then(jobs => {
            console.log(jobs);
            let jobsNames = [];
            for (let job in jobs.body.items){
                // console.log("aaa");
                // console.log(job);
                if(jobs.body.items.hasOwnProperty(job)){
                    if(jobs.body.items[job].status.succeeded===1){
                        jobsNames.push(jobs.body.items[job].metadata.name);
                        console.log(jobs.body.items[job].metadata.name);
                    }
                }
            }
            console.log("Job names: ");
            console.log(jobsNames);
            res.send({data:jobs, jobsNames:jobsNames});
        })
});


createNewJob = async (values) => {
    const client = await openshiftRestClient(settings);
    // console.log(projectName);
    console.log(values);
    let a = await client.api.v1.ns(projectName).configmaps.get();
    console.log(a);
    console.log(a.body.items);
    // const newJob = await
    // PATCH /api/v1/namespaces/$NAMESPACE/configmaps/$NAME HTTP/1.1
    let b = await client.api.v1.ns(projectName).configmaps('cm-appsimulator').patch({
    // "body":{"metadata":{"annotations":{"openshift.io/active-deadline-seconds-override":"9999"}}}

            // pageLoadTime: '3', numberOfRequestsPerLoad: '200', memoryUsage: '5', pageSize:'3',
            // numberOfRequests:'2', responseSize:'2', latency:'10', bandwidth:'1000', intervalBetweenRequests:'10'
    "body":{"data": {
            // "aa":"a"
        "components.yaml": "- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: "+ values.memoryUsage
            +" # MB\n  outputSize: 1 # KB\n- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: "+values.memoryUsage
            +" # MB\n  outputSize: 1 # KB\n  io:\n    mode: startup # startup, regular, or both\n "
            +"   numRequests: "+values.numberOfRequests+"\n    responseSize: "+ values.responseSize
            +" # KB\n    latency: "+values.latency+" # ms\n    bandwidth: "+values.bandwidth
            +" # Mbps\n    intervalBetweenRequests: "+values.intervalBetweenRequests+" # ms\n- parents:\n    - 1\n    - 2\n"
            +"  cpuTime: 5 # ms\n  memoryUsage: "+values.memoryUsage+" # MB\n  outputSize: 1 # KB\n  io:\n    "
            +"mode: both # startup, regular, or both\n    numRequests: "+values.numberOfRequests+"\n    responseSize: "+
            values.responseSize+" # KB\n    latency: "+values.latency+" # ms\n    bandwidth: "+values.bandwidth
            +" # Mbps\n    intervalBetweenRequests: "+values.intervalBetweenRequests+" # ms"
        }
    }
    }
    ).catch(function(error) {
        console.log(error);
        // Error handling here!
    });
    console.log(b);
    // /api/v1/namespaces/$NAMESPACE/configmaps
    // client.api.v1.ns(projectName).configmaps.post(
    //     {
    //         "body":
    //             {s
    //                 "kind": "ConfigMap",
    //                 "apiVersion": "v1",
    //                 "metadata": {
    //                     "name": "cm-appsimulator123"
    //                     // "namespace": "2262804sproject"
    //                 },
    //                 "data": {
    //                     "components.yaml": "- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: 0 # MB\n  outputSize: 1 # KB\n- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: 0 # MB\n  outputSize: 1 # KB\n  io:\n    mode: startup # startup, regular, or both\n    numRequests: 2\n    responseSize: 2 # KB\n    latency: 10 # ms\n    bandwidth: 1000 # Mbps\n    intervalBetweenRequests: 10 # ms\n- parents:\n    - 1\n    - 2\n  cpuTime: 5 # ms\n  memoryUsage: 0 # MB\n  outputSize: 1 # KB\n  io:\n    mode: both # startup, regular, or both\n    numRequests: 2\n    responseSize: 2 # KB\n    latency: 10 # ms\n    bandwidth: 1000 # Mbps\n    intervalBetweenRequests: 10 # ms"
    //                 }
    //             }
    //     });
    let jobname = "job-appsimulator-flinksim-"+values.jobName;
    console.log(jobname);
    client.apis.batch.v1.ns(projectName).jobs.post({
            "body": {
                "apiVersion": "batch/v1",
                "kind": "Job",
                "metadata": {
                    "name": jobname,
                    "namespace": "2262804sproject"
                },
                "spec": {
                    "parallelism": 1,
                    "completions": 1,
                    "template": {
                        "metadata": {
                            "labels": {
                                "deploymentconfig": jobname,
                                "app": "appsimulator",
                                "group": "2262804s"
                            }
                        },
                        "spec": {
                            "containers": [
                                {
                                    "name": "flinksim",
                                    "image": "docker-registry.default.svc:5000/2262804sproject/is-appsimulator-start:v1",
                                    "resources": {},
                                    "volumeMounts": [
                                        {
                                            "name": "config-files",
                                            "mountPath": "/opt/flink/config"
                                        }
                                    ],
                                    "env": [
                                        {
                                            "name": "JOB_MANAGER_RPC_ADDRESS",
                                            "value": "srv-jobmanager"
                                        }
                                        // {
                                        //     "name": "pageLoadTime",
                                        //     "value": values.pageLoadTime
                                        // },
                                        // {
                                        //     "name": "numberOfRequestsPerLoad",
                                        //     "value": values.numberOfRequestsPerLoad
                                        // },
                                        // {
                                        //     "name": "memoryUsage",
                                        //     "value": values.memoryUsage
                                        // },
                                        // {
                                        //     "name": "pageSize",
                                        //     "value": values.pageSize
                                        // },
                                        // {
                                        //     "name": "numberOfRequests",
                                        //     "value": values.numberOfRequests
                                        // },
                                        // {
                                        //     "name": "responseSize",
                                        //     "value": values.responseSize
                                        // },
                                        // {
                                        //     "name": "LATENCY",
                                        //     "value": values.latency
                                        // },
                                        // {
                                        //     "name": "bandwidth",
                                        //     "value": values.bandwidth
                                        // },
                                        // {
                                        //     "name": "intervalBetweenRequests",
                                        //     "value": values.intervalBetweenRequests
                                        // }

                                    ],
                                    "imagePullPolicy": "Always"
                                }
                            ],
                            "volumes": [
                                {
                                    "name": "config-files",
                                    "configMap": {
                                        "name": "cm-appsimulator"
                                    }
                                }
                            ],
                            "restartPolicy": "Never"
                        }
                    }
                },
                "status": {}
            }
        }
    );
    // console.log("New Job:", newJob);
    // return newJob;

};

// pageLoadTime: '3', numberOfRequestsPerLoad: '200', memoryUsage: '5', pageSize:'3',
//     numberOfRequests:'2', responseSize:'2', latency:'10', bandwidth:'1000', intervalBetweenRequests:'10'

removeJob = async () => {
    const client = await openshiftRestClient(settings);
    console.log(projectName);
    // const projects = await client.apis.build.v1.ns(projectName).builds.get();
    // console.log(projects);
    // const namespaces = await client.apis.build.v1.ns('2262804sproject').pods;

    const job = await client.apis.batch.v1.ns(projectName).jobs('job-appsimulator-flinksim').delete();
    console.log("Job:", job);
    return job;
};

getJobs = async () => {
    const client = await openshiftRestClient(settings);
    console.log(projectName);
    // GET /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
    const completedJobs = await client.apis.batch.v1.ns(projectName).jobs().get();
    console.log("Completed Jobs:", completedJobs);
    return completedJobs;
};

function getRunningJobs(jobs) {
    let runningJobs = [];
    for (let job in jobs.body.items) {
        // console.log("aaa");
        // console.log(job);
        if (jobs.body.items.hasOwnProperty(job)) {
            if (jobs.body.items[job].status.succeeded !== 1) {
                runningJobs.push(jobs.body.items[job].metadata.name);
                console.log(jobs.body.items[job].metadata.name);
            }
        }
    }
    console.log("Running jobs: ");
    console.log(runningJobs);
    return runningJobs;
}

function normalizePort(val) {
    var port = parseInt(val, 10);

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

// var port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || '8080'); 
// var ip = process.env.OPENSHIFT_NODEJS_IP;
//         if (typeof ip === "undefined") {
//              Log errors on OpenShift but continue w/ 127.0.0.1 - this
//              allows us to run/test the app locally.
//             console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
//             ip = "127.0.0.1";
//         };
// app.set('ip', port);  
// app.set('port', port);

// var server = http.createServer(app);
// 
// server.listen(port, ip);
// server.on('error', onError);
// server.on('listening', onListening);

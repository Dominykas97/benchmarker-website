// const rest = require('../client/rest');
const express = require('express');
const app = express();
// const child_process = require("child_process");
// const sleep = require('sleep');
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
    // let podName;
    for (let job in jobsServicesDeploymentConfigs) {
        if (job != null) {
            getPodName(jobsServicesDeploymentConfigs[job].deploymentConfigTaskManagerName).then(podName => {
                // if(podName!=null) {
                console.log("Pod name:");
                console.log(podName);
                // }
            })
        }
    }
    getJobs()
        .then(jobs => {
            // console.log(jobs);
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
                patchConfigMap(jobParameters);
                createNewJob(jobParameters);
                // res.redirect('/new');
            }
        });
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

function getDeploymentConfigJobManagerName(jobName){
    let deploymentConfigName = jobName.replace("job-", "dc-");
    return deploymentConfigName.replace("-flinksim-", "-flinksim-jobmanager-");
}
function getDeploymentConfigTaskManagerName(jobName){
    let deploymentConfigName = jobName.replace("job-", "dc-");
    return deploymentConfigName.replace("-flinksim-", "-flinksim-taskmanager-");
}
app.post('/new_job', (req, res) => {
    // console.log(req);
    // (async () => {
    //     let jobs = getJobs();
    getJobs()
        .then(jobs => {
                // console.log(jobs);
                let runningJobs = getRunningJobs(jobs);
                console.log("running jobs:");
                console.log(runningJobs);
                req.body.jobName = req.body.jobType + req.body.jobName;
                if (typeof runningJobs === 'undefined' || runningJobs.length === 0) {

                    let serviceJobManagerName = req.body.jobName.replace("job-", "srv-jobmanager-");
                    let serviceTaskManagerName = req.body.jobName.replace("job-", "srv-taskmanager-");
                    // let deploymentConfigName = req.body.jobName.replace("job-", "dc-");
                    // let deploymentConfigJobManagerName = deploymentConfigName.replace("-flinksim-", "-flinksim-jobmanager-");
                    // let deploymentConfigTaskManagerName = deploymentConfigName.replace("-flinksim-", "-flinksim-taskmanager-");
                    console.log(serviceJobManagerName);
                    console.log(serviceTaskManagerName);
                    // console.log(deploymentConfigJobManagerName);
                    // console.log(deploymentConfigTaskManagerName);
                    // let name = JSON.stringify(req.body.jobName);
                    jobsServicesDeploymentConfigs[req.body.jobName] = {
                        "jobName": req.body.jobName,
                        "serviceJobManagerName": serviceJobManagerName,
                        "serviceTaskManagerName": serviceTaskManagerName,
                        "deploymentConfigJobManagerName": getDeploymentConfigJobManagerName(req.body.jobName),//deploymentConfigJobManagerName,
                        "deploymentConfigTaskManagerName": getDeploymentConfigTaskManagerName(req.body.jobName)//deploymentConfigTaskManagerName
                    };
                    // console.log(a);
                    console.log("/new_job jobsServicesDeploymentConfigs:");
                    console.log(jobsServicesDeploymentConfigs);
                    // jobsServicesDeploymentConfigs[req.body.jobName] = jobDescription;
                    //     key:req.body.jobName,
                    //     value:a
                    // });
                    patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName);
                    patchFlinkConfigMap(serviceJobManagerName);
                    patchConfigMap(req.body);
                    // await new Promise(r => setTimeout(r, 60000)).then(() => {

                    createTaskManagerService(req.body, serviceTaskManagerName);
                    // });
                    // child_process.execSync("sleep 60");
                    // await new Promise(r => setTimeout(r, 60000)).then(() => {
                    // setTimeout(function() { createJobManagerService(req.body, serviceJobManagerName); }, 60000);
                    createJobManagerService(req.body, serviceJobManagerName);
                    // });
                    // await new Promise(r => setTimeout(r, 120000)).then(() => {
                    // deployTaskManager(req.body, serviceTaskManagerName, deploymentConfigTaskManagerName);
                    // });
                    // child_process.execSync("sleep 60");
                    // await new Promise(r => setTimeout(r, 180000)).then(() => {
                    setTimeout(function () {
                        deployJobManager(req.body, serviceJobManagerName, getDeploymentConfigJobManagerName(req.body.jobName));
                    }, 10000);
                    // child_process.execSync("sleep 60");
                    setTimeout(function () {
                        deployTaskManager(req.body, serviceJobManagerName, getDeploymentConfigTaskManagerName(req.body.jobName));
                    }, 20000);
                    // deployJobManager(req.body, serviceJobManagerName, deploymentConfigJobManagerName);
                    // });
                    // child_process.execSync("sleep 60");
                    // await new Promise(r => setTimeout(r, 240000)).then(() => {
                    setTimeout(function () {
                        createNewJob(req.body, serviceJobManagerName);
                    }, 30000);
                    // createNewJob(req.body, serviceJobManagerName);
                    // });

                    // createTaskManagerService(req.body, serviceTaskManagerName);
                    // createJobManagerService(req.body, serviceJobManagerName);
                    // deployTaskManager(req.body, serviceTaskManagerName, deploymentConfigTaskManagerName);
                    // deployJobManager(req.body, serviceJobManagerName, deploymentConfigJobManagerName);
                    // console.log("STATUS:");
                    // console.log(getServiceStatus(serviceJobManagerName));
                    // console.log(getServiceStatus(serviceTaskManagerName));
                    // createNewJob(req.body, serviceJobManagerName);
                    // res.send({alerts:'New test created.'});
                    res.redirect('/new');
                } else {
                    jobsQueue.push(req.body);
                    // res.send({alerts:'New test added to a queue.'});
                    console.log("Jobs queue:");
                    console.log(jobsQueue);
                }
            }
        )
    // })();
});

app.post('/remove_job', (req, res) => {
    console.log("app.post removing name:");
    console.log(req.body.name);
    removeJob(req.body.name);
    let a = jobsServicesDeploymentConfigs[req.body.name];
    if (typeof a !== 'undefined') {
        removeService(a.serviceTaskManagerName);
        removeService(a.serviceJobManagerName);
        removeDeploymentConfig(a.deploymentConfigTaskManagerName);
        removeDeploymentConfig(a.deploymentConfigJobManagerName);
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

app.get('/running_jobs', (req, res) => {
    getJobs()
        .then(jobs => {
            console.log(jobs);
            let runningJobs = getRunningJobs(jobs);
            let queueNames = getQueueNames();
            res.send({
                data: jobs,
                runningJobs: runningJobs,
                queueNames: queueNames,
                deletedQueueNames: deletedQueueNames
            });
        })
});

app.get('/completed_jobs', async (req, res) => {
    let jobItems = await getJobs();
    // .then(jobItems => {
    // console.log(jobs);
    let jobsNames = [];
    let podsNames = {};
    let jobs = jobItems.body.items;
    for (let job in jobs) {
        // console.log("aaa");
        // console.log(job);
        if (jobs.hasOwnProperty(job)) {
            if (jobs[job].status.succeeded === 1) {
                jobsNames.push(jobs[job].metadata.name);
                // if(jobsServicesDeploymentConfigs[jobs[job].metadata.name].has("deploymentConfigTaskManagerName")){
                //     let podName = getPodName(jobsServicesDeploymentConfigs[jobs[job].metadata.name].deploymentConfigTaskManagerName);
                //     console.log("POD NAME");
                //     console.log(podName);
                // }
                // console.log(jobs.body.items[job].metadata.name);
                let podName = await getPodName(getDeploymentConfigTaskManagerName(jobs[job].metadata.name));//completedJob.deploymentConfigTaskManagerName);
                //.then(podName => {
                console.log(jobs[job].metadata.name);
                console.log(getDeploymentConfigTaskManagerName(jobs[job].metadata.name));
                console.log("POD NAME");
                console.log(podName);
                podsNames[jobs[job].metadata.name] = podName;
                console.log(podsNames);

                let completedJob = jobsServicesDeploymentConfigs[jobs[job].metadata.name];
                if (typeof completedJob !== 'undefined') {
                    // if (completedJob.deploymentConfigTaskManagerName != null) {
                        // })
                    // }
                    removeService(completedJob.serviceTaskManagerName);
                    removeService(completedJob.serviceJobManagerName);
                    removeDeploymentConfig(completedJob.deploymentConfigTaskManagerName);
                    removeDeploymentConfig(completedJob.deploymentConfigJobManagerName);
                    delete jobsServicesDeploymentConfigs[jobs[job].metadata.name];
                }
            }
        }
    }
    // console.log("Job names: ");
    // console.log(jobsNames);
    console.log("PODS NAMESSS");
    console.log(podsNames);
    // getPodName().then
    res.send({data: jobs, jobsNames: jobsNames, podsNames: podsNames});
    // }
    // )
});

async function getPodName(deploymentConfigName) {
    const client = await openshiftRestClient(settings);
    // console.log("Trying to remove job:");
    // console.log(name);
    //GET /api/v1/namespaces/$NAMESPACE/pods HTTP/1.1
    // const job = await client.api.v1.ns(projectName).pods().get();
    // console.log("Pods:");
    // console.log(job);
    const podsInfo = await client.api.v1.ns(projectName).pods().get({qs: {labelSelector: 'deploymentconfig=' + deploymentConfigName}});
    let pods = podsInfo.body.items;
    console.log("Pods2:");
    console.log(pods);
    let podName;
    for (let pod in pods) {
        if (pods.hasOwnProperty(pod)) {
            // console.log(pod);
            // console.log(pods[pod]);
            console.log(pods[pod].status);
            // console.log(pods[pod].metadata.name);
            if (pods[pod].status.phase === 'Running') {
                podName = pods[pod].metadata.name;
                // jobsServicesDeploymentConfigs[job]["de"]
            }
        }
    }
    return podName;
}

async function removeJob(name) {
    const client = await openshiftRestClient(settings);
    console.log("Trying to remove job:");
    console.log(name);
    const job = await client.apis.batch.v1.ns(projectName).jobs(name).delete();
    console.log("Job:", job);
    return job;
}

async function getJobs() {
    const client = await openshiftRestClient(settings);
    // GET /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
    const completedJobs = await client.apis.batch.v1.ns(projectName).jobs().get();
    // console.log("Completed Jobs:", completedJobs);
    return completedJobs;
}

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
        // console.log("aaa");
        // console.log(job);
        if (jobs.body.items.hasOwnProperty(job)) {
            let jobName = jobs.body.items[job].metadata.name;
            jobNames.push(jobName);
            // console.log("AA");
            // console.log(jobName);
            // console.log("jobsServicesDeploymentConfigs:");
            // console.log(jobsServicesDeploymentConfigs);
            // if(jobName in jobsServicesDeploymentConfigs) {
            //     console.log(jobsServicesDeploymentConfigs[jobName].jobName);
            // }

            if (jobs.body.items[job].status.succeeded !== 1) {
                runningJobs.push(jobName);
                // console.log(jobName);
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

async function removeService(name) {
    const client = await openshiftRestClient(settings);
//    DELETE /api/v1/namespaces/$NAMESPACE/services/$NAME HTTP/1.1
    let a = await client.api.v1.ns(projectName).services(name).delete();
}

async function getServiceStatus(name) {
    const client = await openshiftRestClient(settings);
    // GET /api/v1/namespaces/$NAMESPACE/services/$NAME/status HTTP/1.1
    return await client.api.v1.ns(projectName).services(name).status.get();
}

async function removeDeploymentConfig(name) {
    const client = await openshiftRestClient(settings);
    //DELETE /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs/$NAME HTTP/1.1
    let a = await client.apis.app.v1.ns(projectName).deploymentconfigs(name).delete({qs: {propagationPolicy: 'Orphan'}});
}

async function createJobManagerService(values, serviceJobManagerName) {
    const client = await openshiftRestClient(settings);
    //job-appsimulator-flinksim-a
    // let name = values.jobName.replace("job-", "srv-jobmanager-");
// POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
    let a = await client.api.v1.ns(projectName).services.post({
        "body":
            {
                "apiVersion": "v1",
                "kind": "Service",
                "metadata": {
                    "name": serviceJobManagerName,
                    "namespace": projectName
                },
                "spec": {
                    "ports": [
                        {
                            "name": "6123",
                            "port": 6123,
                            "targetPort": 6123
                        },
                        {
                            "name": "6124",
                            "port": 6124,
                            "targetPort": 6124
                        },
                        {
                            "name": "8081",
                            "port": 8081,
                            "targetPort": 8081
                        },
                        {
                            "name": "9250",
                            "port": 9250,
                            "targetPort": 9250
                        }
                    ],
                    "selector": {
                        "group": "appsimulator-flink-jobmanager"
                    }
                },
                "status": {
                    "loadBalancer": {}
                }
            }
    });
    await new Promise(r => setTimeout(r, 60000)).then(() => {
        // Do something after the sleep!
        console.log("Sleeping");
        return a
    });
}

async function createTaskManagerService(values, serviceTaskManagerName) {
    const client = await openshiftRestClient(settings);
    //job-appsimulator-flinksim-a
    // let name = values.jobName.replace("job-", "srv-jobmanager-");
// POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
    let a = await client.api.v1.ns(projectName).services.post({
        "body":
            {
                "apiVersion": "v1",
                "kind": "Service",
                "metadata": {
                    "name": serviceTaskManagerName,
                    "namespace": projectName
                },
                "spec": {
                    "ports": [
                        {
                            "name": "9250",
                            "port": 9250,
                            "targetPort": 9250
                        },
                        {
                            "name": "6121",
                            "port": 6121,
                            "targetPort": 6121
                        },
                        {
                            "name": "6122",
                            "port": 6122,
                            "targetPort": 6122
                        }
                    ],
                    "selector": {
                        "group": "appsimulator-flink-taskmanager"
                    }
                },
                "status": {
                    "loadBalancer": {}
                }
            }
    });
    // sleep.sleep(20);
    // await new Promise(r => setTimeout(r, 60000)).then(() => {
    //     // Do something after the sleep!
    //     return a
    // });
}

async function deployJobManager(values, serviceJobManagerName, deploymentConfigJobManagerName) {
    const client = await openshiftRestClient(settings);
    // console.log(name);
    // console.log(serviceName);
    // GET /oapi/v1/namespaces/$NAMESPACE/deploymentconfigs HTTP/1.1
    // let b = await client.oapi.v1.ns(projectName).deploymentconfigs.get();
    // console.log(b);
    //POST /oapi/v1/namespaces/$NAMESPACE/deploymentconfigs HTTP/1.1
//POST /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs HTTP/1.1
    let a = await client.apis.app.v1.ns(projectName).deploymentconfigs.post({
            "body": {
                "apiVersion": "apps.openshift.io/v1",
                "kind": "DeploymentConfig",
                "metadata": {
                    "name": deploymentConfigJobManagerName,
                    "namespace": projectName
                },
                "spec": {
                    "replicas": 1,
                    "strategy": {
                        "resources": {}
                    },
                    "template": {
                        "metadata": {
                            "labels": {
                                "deploymentconfig": deploymentConfigJobManagerName,
                                "app": "appsimulator",
                                "group": "appsimulator-flink-jobmanager"
                            }
                        },
                        "spec": {
                            "containers": [
                                {
                                    "image": " ",
                                    "name": "jobmanager",
                                    "args": [
                                        "jobmanager"
                                    ],
                                    "env": [
                                        {
                                            "name": "JOB_MANAGER_RPC_ADDRESS",
                                            "value": serviceJobManagerName
                                        }
                                    ],
                                    "ports": [
                                        {
                                            "containerPort": 6123
                                        },
                                        {
                                            "containerPort": 6124
                                        },
                                        {
                                            "containerPort": 8081
                                        },
                                        {
                                            "containerPort": 9250
                                        }
                                    ],
                                    "resources": {}
                                }
                            ]
                        }
                    },
                    "restartPolicy": "Never",
                    "triggers": [
                        {
                            "type": "ConfigChange"
                        },
                        {
                            "type": "ImageChange",
                            "imageChangeParams": {
                                "automatic": true,
                                "containerNames": [
                                    "jobmanager"
                                ],
                                "from": {
                                    "kind": "ImageStreamTag",
                                    "name": "is-appsimulator-bench:v1"
                                }
                            }
                        }
                    ]
                },
                "status": {}
            }
        }
    );
    // return name;
    await new Promise(r => setTimeout(r, 60000)).then(() => {
        // Do something after the sleep!
        return a
    });
}

async function deployTaskManager(values, serviceJobManagerName, deploymentConfigJobManagerName) {
    const client = await openshiftRestClient(settings);
    let a = await client.apis.app.v1.ns(projectName).deploymentconfigs.post({
        "body": {
            "apiVersion": "apps.openshift.io/v1",
            "kind": "DeploymentConfig",
            "metadata": {
                "name": deploymentConfigJobManagerName,
                "namespace": projectName
            },
            "spec": {
                "replicas": 1,
                "strategy": {
                    "resources": {}
                },
                "template": {
                    "metadata": {
                        "labels": {
                            "deploymentconfig": deploymentConfigJobManagerName,
                            "app": "appsimulator",
                            "group": "appsimulator-flink-taskmanager"
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "args": [
                                    "taskmanager"
                                ],
                                "env": [
                                    {
                                        "name": "JOB_MANAGER_RPC_ADDRESS",
                                        "value": serviceJobManagerName
                                    }
                                ],
                                "image": " ",
                                "name": "taskmanager",
                                "ports": [
                                    {
                                        "containerPort": 6121
                                    },
                                    {
                                        "containerPort": 6122
                                    },
                                    {
                                        "containerPort": 9250
                                    }
                                ],
                                "resources": {}
                            }
                        ]
                    }
                },
                "restartPolicy": "Never",
                "triggers": [
                    {
                        "type": "ConfigChange"
                    },
                    {
                        "type": "ImageChange",
                        "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                                "taskmanager"
                            ],
                            "from": {
                                "kind": "ImageStreamTag",
                                "name": "is-appsimulator-bench:v1"
                            }
                        }
                    }
                ]
            },
            "status": {}
        }
    });
    await new Promise(r => setTimeout(r, 60000)).then(() => {
        // Do something after the sleep!
        return a
    });
}

async function patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName) {
    const client = await openshiftRestClient(settings);
    let b = await client.api.v1.ns(projectName).configmaps('cm-appsimulator').patch({
            "body": {
                "data": {
                    "prometheus.yml":
                        "global:\n" +
                        "  scrape_interval:     1s\n" +
                        "  evaluation_interval: 1s\n" +
                        "\n" +
                        "scrape_configs:\n" +
                        "  - job_name: 'benchmarker'\n" +
                        "    static_configs:\n" +
                        "      - targets: ['srv-jobmanager:9250', 'srv-taskmanager:9250', '" + serviceJobManagerName + ":9250', '" + serviceTaskManagerName + ":9250'" + "]"

                }
            }
        }
    ).catch(function (error) {
        console.log(error);
        // Error handling here!
    });
}

async function patchFlinkConfigMap(serviceJobManagerName) {
    const client = await openshiftRestClient(settings);
    let b = await client.api.v1.ns(projectName).configmaps('cm-appsimulator').patch({
            "body": {
                "data": {
                    "flink-conf.yaml": "jobmanager.rpc.address: " + serviceJobManagerName + "\n" +
                        "jobmanager.rpc.port: 6123" + "\n" +
                        "jobmanager.heap.size: 1024m" + "\n" +

                        "taskmanager.heap.size: 1024m" + "\n" +
                        "taskmanager.numberOfTaskSlots: 1" + "\n" +

                        "parallelism.default: 1" + "\n" +

                        "metrics.latency.interval: 1000" + "\n" +
                        "metrics.reporters: prom" + "\n" +
                        "metrics.reporter.prom.class: org.apache.flink.metrics.prometheus.PrometheusReporter" + "\n" +
                        "metrics.reporter.prom.port: 9250"
                }
            }
        }
    ).catch(function (error) {
        console.log(error);
        // Error handling here!
    });
}

async function patchConfigMap(values) {
    const client = await openshiftRestClient(settings);
    // PATCH /api/v1/namespaces/$NAMESPACE/configmaps/$NAME HTTP/1.1
    let b = await client.api.v1.ns(projectName).configmaps('cm-appsimulator').patch({
            "body": {
                "data": {
                    "components.yaml": "- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: " + values.memoryUsage
                        + " # MB\n  outputSize: 1 # KB\n- parents:\n    - 0\n  cpuTime: 5 # ms\n  memoryUsage: " + values.memoryUsage
                        + " # MB\n  outputSize: 1 # KB\n  io:\n    mode: startup # startup, regular, or both\n "
                        + "   numRequests: " + values.numberOfRequests + "\n    responseSize: " + values.responseSize
                        + " # KB\n    latency: " + values.latency + " # ms\n    bandwidth: " + values.bandwidth
                        + " # Mbps\n    intervalBetweenRequests: " + values.intervalBetweenRequests + " # ms\n- parents:\n    - 1\n    - 2\n"
                        + "  cpuTime: 5 # ms\n  memoryUsage: " + values.memoryUsage + " # MB\n  outputSize: 1 # KB\n  io:\n    "
                        + "mode: both # startup, regular, or both\n    numRequests: " + values.numberOfRequests + "\n    responseSize: " +
                        values.responseSize + " # KB\n    latency: " + values.latency + " # ms\n    bandwidth: " + values.bandwidth
                        + " # Mbps\n    intervalBetweenRequests: " + values.intervalBetweenRequests + " # ms"
                }
            }
        }
    ).catch(function (error) {
        console.log(error);
        // Error handling here!
    });
}

async function createNewJob(values, serviceJobManagerName) {
    const client = await openshiftRestClient(settings);

    // POST /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
    let a = await client.apis.batch.v1.ns(projectName).jobs.post({
            "body": {
                "apiVersion": "batch/v1",
                "kind": "Job",
                "metadata": {
                    "name": values.jobName,
                    "namespace": "2262804sproject"
                },
                "spec": {
                    "parallelism": 1,
                    "completions": 1,
                    "template": {
                        "metadata": {
                            "labels": {
                                "deploymentconfig": values.jobName,
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
                                            "value": serviceJobManagerName
                                        }
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

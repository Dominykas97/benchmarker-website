const openshiftRestClient = window.require('openshift-rest-client').OpenshiftClient;
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

async function aa(){
    const client = await openshiftRestClient(settings);
    console.log(projectName);
    const projects = await client.apis.build.v1.ns(projectName).builds.get();
    console.log(projects);
    // const namespaces = await client.apis.build.v1.ns('2262804sproject').pods;

    // const job = await client.apis.batch.v1.ns(projectName).jobs('job-appsimulator-flinksim').delete();
    // console.log("Job:", job);
    // // /apis/batch/v1/namespaces/$NAMESPACE/jobs/$NAME


    // POST /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1


    const jobs = await client.apis.batch.v1.ns(projectName).jobs.get();
    console.log('Jobs: ', jobs);
    // console.log(Object.keys(deployment['body']['items']));
    console.log(jobs['body']['items']);
    // /apis/batch/v1/jobs
    // const namespaces = await client.apis.build.v1.ns('2262804sproject').get_pods
    // console.log('Namespaces: ', deployment)
}

async function removeJob(){
    const client = await openshiftRestClient(settings);
    console.log(projectName);
    // const projects = await client.apis.build.v1.ns(projectName).builds.get();
    // console.log(projects);
    // const namespaces = await client.apis.build.v1.ns('2262804sproject').pods;

    const job = await client.apis.batch.v1.ns(projectName).jobs('job-appsimulator-flinksim').delete();
    console.log("Job:", job);
}
module.exports = {
    createNewJob: async function (values){
    // async function createNewJob(values) {
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
                "body": {
                    "data": {
                        // "aa":"a"
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
        let jobname = "job-appsimulator-flinksim-" + values.jobName;
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
        // const client = await openshiftRestClient(settings);
        // console.log(projectName);
        //
        // const newJob = await client.apis.batch.v1.ns(projectName).jobs.post({
        //         "body": {
        //             "apiVersion": "batch/v1",
        //             "kind": "Job",
        //             "metadata": {
        //                 "name": "job-appsimulator-flinksim",
        //                 "namespace": "2262804sproject"
        //             },
        //             "spec": {
        //                 "parallelism": 1,
        //                 "completions": 1,
        //                 "template": {
        //                     "metadata": {
        //                         "labels": {
        //                             "deploymentconfig": "job-appsimulator-flinksim",
        //                             "app": "appsimulator",
        //                             "group": "2262804s"
        //                         }
        //                     },
        //                     "spec": {
        //                         "containers": [
        //                             {
        //                                 "name": "flinksim",
        //                                 "image": "docker-registry.default.svc:5000/2262804sproject/is-appsimulator-start:v1",
        //                                 "resources": {},
        //                                 "volumeMounts": [
        //                                     {
        //                                         "name": "config-files",
        //                                         "mountPath": "/opt/flink/config"
        //                                     }
        //                                 ],
        //                                 "env": [
        //                                     {
        //                                         "name": "JOB_MANAGER_RPC_ADDRESS",
        //                                         "value": "srv-jobmanager"
        //                                     }
        //                                 ],
        //                                 "imagePullPolicy": "Always"
        //                             }
        //                         ],
        //                         "volumes": [
        //                             {
        //                                 "name": "config-files",
        //                                 "configMap": {
        //                                     "name": "cm-appsimulator"
        //                                 }
        //                             }
        //                         ],
        //                         "restartPolicy": "Never"
        //                     }
        //                 }
        //             },
        //             "status": {}
        //         }
        //     }
        // );
        // console.log("New Job:", newJob);

    }
};
// removeJob();
// createNewJob();

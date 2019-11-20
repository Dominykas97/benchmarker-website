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

export async function createNewJob() {
    const client = await openshiftRestClient(settings);
    console.log(projectName);

    const newJob = await client.apis.batch.v1.ns(projectName).jobs.post({
            "body": {
                "apiVersion": "batch/v1",
                "kind": "Job",
                "metadata": {
                    "name": "job-appsimulator-flinksim",
                    "namespace": "2262804sproject"
                },
                "spec": {
                    "parallelism": 1,
                    "completions": 1,
                    "template": {
                        "metadata": {
                            "labels": {
                                "deploymentconfig": "job-appsimulator-flinksim",
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
    console.log("New Job:", newJob);

}

removeJob();
// createNewJob();

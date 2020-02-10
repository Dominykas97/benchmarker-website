module.exports = class Rest {
    constructor() {
        this.openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
        this.projectName = '2262804sproject';
        this.settings = {};

        this.settings.config = {
            url: 'https://idagpu-head.dcs.gla.ac.uk:8443',
            auth: {
                username: '2262804s',
                password: 'bench12356'
            },
            insecureSkipTlsVerify: true
        };
        this.openshiftRestClient(this.settings).then(client => {
            this.client = client;
        });
    }

    async getJobs() {
        // GET /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
        return this.client.apis.batch.v1.ns(this.projectName).jobs().get().catch(function (error) {
            console.log(error);
        });
    }

    async removeJob(name) {
        // DELETE /apis/batch/v1/namespaces/$NAMESPACE/jobs/$NAME HTTP/1.1
        return this.client.apis.batch.v1.ns(this.projectName).jobs(name).delete().catch(function (error) {
            console.log(error);
        });
    }

    async createNewJob(values, serviceJobManagerName) {
        // POST /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
        let a = await this.client.apis.batch.v1.ns(this.projectName).jobs.post({
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
        ).catch(function (error) {
            console.log(error);
        });
    }

    async getPodName(deploymentConfigName) {
        // GET /api/v1/namespaces/$NAMESPACE/pods HTTP/1.1
        const podsInfo = await this.client.api.v1.ns(this.projectName).pods().get({qs: {labelSelector: 'deploymentconfig=' + deploymentConfigName}}).catch(function (error) {
            console.log(error);
        });
        let pods = podsInfo.body.items;

        let podName;
        for (let pod in pods) {
            if (pods.hasOwnProperty(pod)) {
                if (pods[pod].status.phase === 'Running') {
                    podName = pods[pod].metadata.name;
                }
            }
        }
        return podName;
    }

    async patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName) {
        let oldConfigFull = await this.client.api.v1.ns(this.projectName).configmaps('cm-appsimulator').get();
        let oldConfigPrometheus = oldConfigFull.body.data['prometheus.yml'];
        // console.log("Old config");
        // console.log(oldConfigPrometheus);

        const regex = /((\w*-\w*)+:\d*)/gm;
        let m;
        let targetsBuilder = [];
        while ((m = regex.exec(oldConfigPrometheus)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
                if (groupIndex === 0) {
                    targetsBuilder.push(match);
                }
            });
        }
        // console.log(targetsBuilder);
        let targets = targetsBuilder.join("', '");
        // console.log(targets);

        let b = this.client.api.v1.ns(this.projectName).configmaps('cm-appsimulator').patch({
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
                            "      - targets: ['" + targets + "', '" + serviceJobManagerName + ":9250', '" + serviceTaskManagerName + ":9250']"
                    }
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
    }

    async patchFlinkConfigMap(serviceJobManagerName) {
        let b = await this.client.api.v1.ns(this.projectName).configmaps('cm-appsimulator').patch({
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
        });
    }

    async patchConfigMap(values) {
        // PATCH /api/v1/namespaces/$NAMESPACE/configmaps/$NAME HTTP/1.1
        let b = await this.client.api.v1.ns(this.projectName).configmaps('cm-appsimulator').patch({
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
        });
    }

    async removeService(name) {
        // DELETE /api/v1/namespaces/$NAMESPACE/services/$NAME HTTP/1.1
        let a = await this.client.api.v1.ns(this.projectName).services(name).delete().catch(function (error) {
            console.log(error);
        });
    }

    async removeReplicationController(name) {
        // DELETE /api/v1/namespaces/$NAMESPACE/replicationcontrollers/$NAME HTTP/1.1
        let a = await this.client.api.v1.ns(this.projectName).replicationcontrollers(name + "-1").delete().catch(function (error) {
            console.log(error);
        });
    }

    async getServiceStatus(name) {
        // GET /api/v1/namespaces/$NAMESPACE/services/$NAME/status HTTP/1.1
        return await this.client.api.v1.ns(this.projectName).services(name).status.get().catch(function (error) {
            console.log(error);
        });
    }

    async patchPodStatus(name) {
        // PATCH /api/v1/namespaces/$NAMESPACE/pods/$NAME/status HTTP/1.1
        let b = await this.client.api.v1.ns(this.projectName).pods(name).patch({
                "body": {
                    "status": {
                        "phase": "Completed"
                    }
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
    }

    async createTaskManagerService(values, serviceTaskManagerName) {
        // POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
        let a = await this.client.api.v1.ns(this.projectName).services.post({
            "body":
                {
                    "apiVersion": "v1",
                    "kind": "Service",
                    "metadata": {
                        "name": serviceTaskManagerName,
                        "namespace": this.projectName
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
        }).catch(function (error) {
            console.log(error);
        });
    }

    async createJobManagerService(values, serviceJobManagerName) {
        // POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
        let a = await this.client.api.v1.ns(this.projectName).services.post({
            "body":
                {
                    "apiVersion": "v1",
                    "kind": "Service",
                    "metadata": {
                        "name": serviceJobManagerName,
                        "namespace": this.projectName
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
        }).catch(function (error) {
            console.log(error);
        });
    }

    async removeDeploymentConfig(name) {
        //DELETE /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs/$NAME HTTP/1.1
        let a = await this.client.apis.app.v1.ns(this.projectName).deploymentconfigs(name).delete().catch(function (error) {
            console.log(error);
        }); // {qs: {propagationPolicy: 'Orphan'}}
    }

    async deployJobManager(values, serviceJobManagerName, deploymentConfigJobManagerName) {
        //POST /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs HTTP/1.1
        let a = await this.client.apis.app.v1.ns(this.projectName).deploymentconfigs.post({
                "body": {
                    "apiVersion": "apps.openshift.io/v1",
                    "kind": "DeploymentConfig",
                    "metadata": {
                        "name": deploymentConfigJobManagerName,
                        "namespace": this.projectName
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
        ).catch(function (error) {
            console.log(error);
        });
    }

    async deployTaskManager(values, serviceJobManagerName, deploymentConfigJobManagerName) {
        this.client.apis.app.v1.ns(this.projectName).deploymentconfigs.post({
            "body": {
                "apiVersion": "apps.openshift.io/v1",
                "kind": "DeploymentConfig",
                "metadata": {
                    "name": deploymentConfigJobManagerName,
                    "namespace": this.projectName
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
        }).catch(function (error) {
            console.log(error);
        });
    }

};

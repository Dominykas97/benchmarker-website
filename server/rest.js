module.exports = class Rest {
    constructor() {
        this.openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
        this.projectName = '2262804sproject';
        this.configMapName = "cm-appsimulator";
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
            console.log(error.line);
        });
    }

    async getJob(name) {
        // GET /apis/batch/v1/namespaces/$NAMESPACE/jobs/$NAME HTTP/1.1
        return this.client.apis.batch.v1.ns(this.projectName).jobs(name).get().catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async removeJob(name) {
        // DELETE /apis/batch/v1/namespaces/$NAMESPACE/jobs/$NAME HTTP/1.1
        return this.client.apis.batch.v1.ns(this.projectName).jobs(name).delete().catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async createNewJob(jobName, serviceJobManagerName, imageStreamStartName) {
        // POST /apis/batch/v1/namespaces/$NAMESPACE/jobs HTTP/1.1
        await this.client.apis.batch.v1.ns(this.projectName).jobs.post({
                "body": {
                    "apiVersion": "batch/v1",
                    "kind": "Job",
                    "metadata": {
                        "name": jobName,
                        "namespace": this.projectName
                    },
                    "spec": {
                        "parallelism": 1,
                        "completions": 1,
                        "template": {
                            "metadata": {
                                "labels": {
                                    "deploymentconfig": jobName,
                                    "app": "appsimulator",
                                    "group": "2262804s"
                                }
                            },
                            "spec": {
                                "containers": [
                                    {
                                        "name": "flinksim",
                                        "image": "docker-registry.default.svc:5000/2262804sproject/" + imageStreamStartName + ":v1",
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
                                            "name": this.configMapName
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
            console.log(error.line);
        });
    }

    async getPodName(deploymentConfigName) {
        // GET /api/v1/namespaces/$NAMESPACE/pods HTTP/1.1
        const podsInfo = await this.client.api.v1.ns(this.projectName).pods().get({qs: {labelSelector: 'deploymentconfig=' + deploymentConfigName}}).catch(function (error) {
            console.log(error);
            console.log(error.line);
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

    async removeStartImageStream(imageStreamStartName) {
        // DELETE /apis/image.openshift.io/v1/namespaces/$NAMESPACE/imagestreams/$NAME HTTP/1.1
        await this.client.apis.image.v1.ns(this.projectName).imagestreams(imageStreamStartName).delete()
            .catch(function (error) {
                console.log(error);
                console.log(error.line);
            });
    }

    async createStartImageStream(imageStreamStartName) {
        // POST /apis/image.openshift.io/v1/namespaces/$NAMESPACE/imagestreams HTTP/1.1
        await this.client.apis.image.v1.ns(this.projectName).imagestreams.post({
            "body":
                {
                    "kind": "ImageStream",
                    "apiVersion": "image.openshift.io/v1",
                    "metadata": {
                        "name": imageStreamStartName,
                        "namespace": this.projectName
                    }
                }
        }).catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async removeStartBuildConfig(buildConfigStartName) {
        // DELETE /apis/build.openshift.io/v1/namespaces/$NAMESPACE/buildconfigs/$NAME HTTP/1.1
        await this.client.apis.build.v1.ns(this.projectName).buildconfigs(buildConfigStartName).delete()
            .catch(function (error) {
                console.log(error);
                console.log(error.line);
            });
    }

    async createStartBuildConfig(serviceJobManagerName, buildConfigStartName, imageStreamStartName) {
        // POST /apis/build.openshift.io/v1/namespaces/$NAMESPACE/buildconfigs HTTP/1.1
        await this.client.apis.build.v1.ns(this.projectName).buildconfigs.post({
            "body":
                {
                    "kind": "BuildConfig",
                    "apiVersion": "build.openshift.io/v1",
                    "metadata": {
                        "name": buildConfigStartName,
                        "namespace": this.projectName
                    },
                    "spec": {
                        "runPolicy": "Serial",
                        "source": {
                            "dockerfile":
                                "FROM flink\n" +
                                "RUN wget http://nfswebhost-2262804sproject.ida.dcs.gla.ac.uk/benchmarker/config/flink-conf.yaml -O conf/flink-conf.yaml\n" +
                                "RUN mv opt/flink-metrics-prometheus-* lib/ && chgrp -Rf root /opt/flink && chmod -Rf 775 /opt/flink\n" +
                                "RUN wget http://nfswebhost-2262804sproject.ida.dcs.gla.ac.uk/benchmarker/target/benchmarker-0.1.jar -O ./benchmarker-0.1.jar\n" +
                                "CMD [\"/bin/bash\", \"-c\", \"flink run -m " + serviceJobManagerName + ":8081 benchmarker-0.1.jar\"]\n"
                        },
                        "strategy": {
                            "type": "Docker",
                            "dockerStrategy": null
                        },
                        "output": {
                            "to": {
                                "kind": "ImageStreamTag",
                                "name": imageStreamStartName + ":v1"
                            }
                        }
                    }
                }
        }).catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async buildStartBuildConfig(buildConfigStartName) {
        //POST /apis/build.openshift.io/v1/namespaces/$NAMESPACE/buildconfigs/$NAME/instantiate HTTP/1.1
        await this.client.apis.build.v1.ns(this.projectName).buildconfigs(buildConfigStartName).instantiate.post({
            "body":
                {
                    "kind": "BuildRequest",
                    "apiVersion": "build.openshift.io/v1",
                    "metadata": {
                        "name": buildConfigStartName
                    },
                    "triggeredBy": [
                        {
                            "message": "Manually triggered"
                        }
                    ]
                }
        }).catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }


    async patchPrometheusConfigMap(serviceJobManagerName, serviceTaskManagerName) {
        let oldConfigFull = await this.client.api.v1.ns(this.projectName).configmaps(this.configMapName).get();
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

        this.client.api.v1.ns(this.projectName).configmaps(this.configMapName).patch({
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
            console.log(error.line);
        });
    }

    async patchFlinkConfigMap(serviceJobManagerName) {
        await this.client.api.v1.ns(this.projectName).configmaps(this.configMapName).patch({
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
            console.log(error.line);
        });
    }

    async patchComponentsConfigMap(values) {
        // PATCH /api/v1/namespaces/$NAMESPACE/configmaps/$NAME HTTP/1.1
        await this.client.api.v1.ns(this.projectName).configmaps(this.configMapName).patch({
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
            console.log(error.line);
        });
    }

    async removeService(name) {
        // DELETE /api/v1/namespaces/$NAMESPACE/services/$NAME HTTP/1.1
        await this.client.api.v1.ns(this.projectName).services(name).delete().catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async removeReplicationController(name) {
        // DELETE /api/v1/namespaces/$NAMESPACE/replicationcontrollers/$NAME HTTP/1.1
        await this.client.api.v1.ns(this.projectName).replicationcontrollers(name + "-1").delete().catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async getServiceStatus(name) {
        // GET /api/v1/namespaces/$NAMESPACE/services/$NAME/status HTTP/1.1
        return await this.client.api.v1.ns(this.projectName).services(name).status.get().catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async patchPodStatus(name) {
        // PATCH /api/v1/namespaces/$NAMESPACE/pods/$NAME/status HTTP/1.1
        await this.client.api.v1.ns(this.projectName).pods(name).patch({
                "body": {
                    "status": {
                        "phase": "Completed"
                    }
                }
            }
        ).catch(function (error) {
            console.log(error);
            console.log(error.line);
        });
    }

    async createTaskManagerService(serviceTaskManagerName) {
        // POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
        await this.client.api.v1.ns(this.projectName).services.post({
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
            console.log(error.line);
        });
    }

    async createJobManagerService(serviceJobManagerName) {
        // POST /api/v1/namespaces/$NAMESPACE/services HTTP/1.1
        await this.client.api.v1.ns(this.projectName).services.post({
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
            console.log(error.line);
        });
    }

    async removeDeploymentConfig(name) {
        //DELETE /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs/$NAME HTTP/1.1
        await this.client.apis.app.v1.ns(this.projectName).deploymentconfigs(name).delete().catch(function (error) {
            console.log(error);
            console.log(error.line);
        }); // {qs: {propagationPolicy: 'Orphan'}}
    }

    async deployJobManager(serviceJobManagerName, deploymentConfigJobManagerName) {
        //POST /apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs HTTP/1.1
        await this.client.apis.app.v1.ns(this.projectName).deploymentconfigs.post({
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
            console.log(error.line);
        });
    }

    async deployTaskManager(serviceJobManagerName, deploymentConfigJobManagerName) {
        await this.client.apis.app.v1.ns(this.projectName).deploymentconfigs.post({
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
            console.log(error.line);
        });
    }
};

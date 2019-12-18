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

// app.set('ip', ip);  
// app.set('port', port);

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

    // console.log("ABCD");
    // console.log(req);
    // let newBook = JSON.parse(req.body);

    // console.log("ABC");
    // console.log(req.body);
    createNewJob(req.body);
    // alert("req");
    // console.log(req);
    // console.log(res);
    res.redirect('/new');
});

app.post('/remove_job', (req, res) => {
    removeJob();
    res.redirect('/new');
});


createNewJob = async (values) => {
    const client = await openshiftRestClient(settings);
    // console.log(projectName);
    console.log(values);
    // const newJob = await
        client.apis.batch.v1.ns(projectName).jobs.post({
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
    // console.log("New Job:", newJob);
    // return newJob;

};

removeJob = async () => {
    const client = await openshiftRestClient(settings);
    console.log(projectName);
    // const projects = await client.apis.build.v1.ns(projectName).builds.get();
    // console.log(projects);
    // const namespaces = await client.apis.build.v1.ns('2262804sproject').pods;

    const job = await client.apis.batch.v1.ns(projectName).jobs('job-appsimulator-flinksim').delete();
    console.log("Job:", job);
    return job;
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

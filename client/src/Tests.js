import React, {Component} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";

class Tests extends Component {
    constructor(props) {
        super(props);
        this.callRemoveRunningTest = this.callRemoveRunningTest.bind(this);
        this.state = {
            data: null,
            model: ".*",
            dataSet: ".*",
            embedSize: ".*",
            dataSplit: ".*"
        };
    }

    callRemoveRunningTest(name) {
        console.log("callRemoveRunningTest is called");
        console.log(name);
        this.setState(prevState => ({
            runningJobs: prevState.runningJobs.filter(el => el !== name)
        }));
        // this.state.runningJobs = [];
        console.log(this.state);
        fetch('/remove_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: name})
        });
        console.log(JSON.stringify({name: name}))
    }

    callRemoveFromQueue(name) {
        console.log("callRemoveFromQueue is called");
        console.log(name);
        this.setState(prevState => ({
            queueNames: prevState.queueNames.filter(el => el !== name)
        }));
        fetch('/remove_from_queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name})
        });
        console.log(JSON.stringify({name: name}))
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({
                data: res.data,
                runningJobs: res.runningJobs,
                queueNames: res.queueNames,
                deletedQueueNames: res.deletedQueueNames,
                podsNames: res.podsNames
            }))
            .catch(err => console.log(err));
        console.log("componentDidMount");
        console.log(this.state.data);
    }

    async callBackendAPI() {
        const response = await fetch('/running_jobs');
        const body = await response.json();
        if (response.status !== 200) {

            throw Error(body.message)
        }
        // console.log(body[0]);
        console.log("callBackendAPI");
        console.log(body);
        return body;
    }

    toggleSelected = (name) => {
        console.log(name);
        this.setState({selectedItemIndex: name});
    };
    onSelectedOptionsChange;

    openInfoPage(jobName) {
        window.open("https://console.ida.dcs.gla.ac.uk/k8s/ns/2262804sproject/jobs/" + jobName, '_blank');
    };

    render() {
        let runningTestsButtonShown = true;
        let runningJobsNames = this.state.runningJobs;
        if (typeof runningJobsNames === 'undefined' || runningJobsNames.length === 0) {
            runningJobsNames = ["There are no running jobs."];
            runningTestsButtonShown = false;
        }
        let queueButtonShown = true;
        let queueNames = this.state.queueNames;
        let deletedQueueNames = this.state.deletedQueueNames;
        // if (deletedQueueNames.s){
        //     console.log(deletedQueueNames.size);
        // }
        let deletedQueueSize;
        if (typeof deletedQueueNames === 'undefined' || Object.keys(deletedQueueNames).length === 0) {
            deletedQueueSize = 0;
        } else {
            deletedQueueSize = deletedQueueNames.size;
        }
        console.log(deletedQueueNames);
        console.log(deletedQueueSize);
        if (typeof queueNames === 'undefined' || (queueNames.length - deletedQueueSize) === 0) {
            // queueNames = ["There are no jobs in the queue."];
            queueButtonShown = false;
        }

        console.log(this.state.runningJobs);
        console.log(this.state.queueNames);
        console.log(this.state.selectedItemIndex);
        let podName = this.state.podsNames || "";

        let sourceCpu = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=0";
        let sourceMemory = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=2";

        let source = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/P2UYRewZz/test?panelId=2&orgId=1" +
            "&var-Model=" + this.state.model +
            "&var-Dataset=" + this.state.dataSet +
            "&var-embed_size=" + this.state.embedSize +
            "&var-data_split=" + this.state.dataSplit;
        console.log(source);
        // const options = [
        //     {value: 'dataset', label: 'Dataset'},
        //     {value: 'data_split', label: 'Data_split'},
        //     {value: 'embed_size', label: 'Embed_size'}
        // ];
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4">
                        <h2>Running tests</h2>
                        {runningTestsButtonShown ? (
                            runningJobsNames.map(name =>
                                <div className="row justify-content-sm-start runningJobs" key={name}
                                     style={{marginBottom: 5}}>
                                    <div className="col-8" key="runningTests">
                                        <div className="btn-group-vertical" key={name}>
                                            <button type="button" className="btn btn-secondary btn-block" key={name}
                                                    onClick={() => this.toggleSelected(name)}>
                                                {name}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div key="runningTestsRemove">
                                            <button type="button" className="btn btn-outline-danger"
                                                    style={{marginRight: 2}}
                                                    onClick={() => this.callRemoveRunningTest(name)}>
                                                Remove
                                            </button>
                                        </div>
                                        <div key="runningTestsInfo">
                                            <button type="button" className="btn btn-outline-info"
                                                    onClick={() => this.openInfoPage(name)}>
                                                Info
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )
                        ) : <div>There are no running jobs.</div>}

                        <h2>Tests in queue</h2>
                        {queueButtonShown ? (
                            queueNames.map(name =>
                                <div className="row justify-content-sm-start" key={"testsInQueue" + name}>
                                    <div className="col-7" key="testsInQueue">
                                        {name}
                                    </div>
                                    <button type="button" className="btn btn-outline-danger" style={{marginRight: 2}}
                                            onClick={() => this.callRemoveFromQueue(name)}>
                                        Remove
                                    </button>
                                    <div key="QueueInfo">
                                        <button type="button" className="btn btn-outline-info"
                                                onClick={() => this.openInfoPage(name)}>
                                            Info
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : <div>There are no jobs in the queue.</div>}
                    </div>
                    <div className="col-8">
                        <Formik
                            initialValues={{
                                model: ".*",
                                dataSet: ".*",
                                embedSize: ".*",
                                dataSplit: ".*"
                            }}
                            enableReinitialize={true}
                            // validate={values => {
                            //     const errors = {};
                            //     return errors;
                            // }}
                            onSubmit={(values) => {
                                this.setState(values);
                                console.log(values);
                                console.log(this.state);
                            }}
                        >
                            {props => (
                                <Form className="form-group">
                                    <div className="row justify-content-start" id={"frm"}>
                                        <div className="col-1 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                            <label htmlFor="model">Model: </label>
                                            <Field className="col-12"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="false" as="select" name="model">
                                                <option value=".*">everything</option>
                                                <option value="VBCAR">VBCAR</option>
                                                <option value="Triple2vec">Triple2vec</option>
                                                <option value="neumf">neumf</option>
                                            </Field>
                                            <ErrorMessage name="model" component="div"/>
                                        </div>

                                        <div className="col-1 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                            <label htmlFor="dataSet">Dataset: </label>
                                            <Field className="col-12"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="false" as="select" name="dataSet">
                                                <option value=".*">everything</option>
                                                <option value="dunnhumby">dunnhumby</option>
                                                <option value="tafeng">tafeng</option>
                                            </Field>
                                            <ErrorMessage name="dataSet" component="div"/>
                                        </div>

                                        <div className="col-3 col-sm-3 col-md-3 col-lg-2">
                                            <label htmlFor="embedSize">Embed size: </label>
                                            <Field className="col-12"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="false" as="select" name="embedSize">
                                                <option value=".*">everything</option>
                                                <option value="32">32</option>
                                                <option value="64">64</option>
                                                <option value="128">128</option>
                                                <option value="256">256</option>
                                                <option value="512">512</option>
                                            </Field>
                                            <ErrorMessage name="embedSize" component="div"/>
                                        </div>

                                        <div className="col-3 col-md-3 col-lg-2">
                                            <label htmlFor="dataSplit">Data split: </label>
                                            <Field className="col-12"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="false" as="select" name="dataSplit">
                                                <option value=".*">everything</option>
                                                <option value="leave_one_item">leave_one_item</option>
                                                <option value="leave_one_basket">leave_one_basket</option>
                                                <option value="temporal">temporal</option>
                                            </Field>
                                            <ErrorMessage name="dataSplit" component="div"/>
                                        </div>
                                        <button type="submit" className="col-2 col-xl-1 btn-secondary"
                                                style={{marginTop: 30}}>
                                            Update
                                        </button>
                                    </div>

                                </Form>
                            )}
                        </Formik>
                        <div className="row">
                            <div className="col-6">
                                <iframe src={source} width="500" height="725" frameBorder="0"/>
                            </div>
                            {this.state.selectedItemIndex !== undefined ? (
                                <div className="row" style={{marginLeft: 20}}>
                                    <div className="col-10">
                                        <div> Pod name: {podName[this.state.selectedItemIndex]}</div>
                                        <div>
                                            <iframe title={"cpu"} src={sourceCpu} width="450" height="350"
                                                    frameBorder="0" scrolling="no"/>
                                        </div>
                                        <div>
                                            <iframe title={"memory"} src={sourceMemory} width="450" height="350"
                                                    frameBorder="0" scrolling="no"/>
                                        </div>
                                    </div>
                                </div>) : null}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tests;

import React, {Component} from "react";

class Completed extends Component {
    constructor(props) {
        super(props);
        this.callRemoveRunningTest = this.callRemoveRunningTest.bind(this);
        this.state = {
            data: null,
            podsNames: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({data: res.data, jobsNames: res.jobsNames, podsNames: res.podsNames}))
            .catch(err => console.log(err));
        // console.log("componentDidMount");
        // console.log(this.state.data);
    }

    async callBackendAPI() {
        const response = await fetch('/completed_jobs');
        const body = await response.json();

        if (response.status !== 200) {

            throw Error(body.message)
        }
        // console.log(body[0]);
        // console.log("callBackendAPI");
        console.log(body);
        return body;
    }

    toggleSelected = (name) => {
        console.log(name);
        this.setState({selectedItemIndex: name});
    };

    callRemoveRunningTest(name) {
        console.log("callRemoveRunningTest is called");
        console.log(name);
        this.setState(prevState => ({
            jobsNames: prevState.jobsNames.filter(el => el !== name)
        }));
        // this.state.runningJobs = [];
        console.log(this.state);
        fetch('/remove_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name})
        });
        console.log(JSON.stringify({name: name}))
    }

    onClick(jobName) {
        window.open("https://console.ida.dcs.gla.ac.uk/k8s/ns/2262804sproject/jobs/" + jobName, '_blank');
    };

    render() {
        let jobsButtonShown = true;
        let podName = this.state.podsNames || "";
        let sourceCpu = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=0";
        let sourceMemory = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=2";
        let data = this.state.data || 'there is no data';
        let names = this.state.jobsNames;
        if (typeof names === 'undefined' || names.length === 0) {
            names = ["There are no completed jobs."];
            jobsButtonShown = false;
        }
        console.log(this.state);
        console.log(this.state.jobsNames);
        console.log(podName["job-appsimulator-flinksim-a2"]);
        // let names = Object;
        if (data !== 'there is no data') {
            console.log(data);
            // console.log(data.body.items[0].metadata.name);
            // names = data.body.items
        }
        return (
            <div className="container-fluid">
                <div className="row justify-content-start">
                    <div className="col-5">
                        <h2>Completed tests</h2>
                        {names.map(name =>
                            jobsButtonShown ? (
                                <div className="row" style={{marginBottom: 5}}>
                                    <div className="col-8 btn-group-vertical" key={name}>
                                        <button type="button" className="btn btn-secondary" key={name}
                                                onClick={() => this.toggleSelected(name)}>{name}</button>
                                    </div>
                                    <div className="col-4">
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
                                                        onClick={() => this.onClick(name)}>
                                                    Info
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : <div>There are no completed jobs.</div>
                        )}
                    </div>
                    {this.state.selectedItemIndex ? (
                        <div className="col-7">
                            {podName[this.state.selectedItemIndex]}
                            <ul>
                                <iframe title={"cpu"} src={sourceCpu} width="450" height="350" frameBorder="0"
                                        scrolling="no"/>
                            </ul>
                            <ul>
                                <iframe title={"memory"} src={sourceMemory} width="450" height="350" frameBorder="0"
                                        scrolling="no"/>
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>

        );
    }
}

export default Completed;


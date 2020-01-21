import React, {Component} from "react";

class Tests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({data: res.data, runningJobs: res.runningJobs, queueNames: res.queueNames}))
            .catch(err => console.log(err));
        console.log("componentDidMount");
        // console.log(this.state.data);
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

    render() {
        let runningJobsNames = this.state.runningJobs;
        if (typeof runningJobsNames === 'undefined' || runningJobsNames.length === 0) {
            runningJobsNames = ["There are no running jobs."];
        }
        let queueNames = this.state.queueNames;
        if (typeof queueNames === 'undefined' || queueNames.length === 0) {
            queueNames = ["There are no jobs in the queue."];
        }
        // console.log(data);
        console.log(this.state.runningJobs);
        console.log(this.state.queueNames);

        return (
            <div>
                <h2>Running tests</h2>
                {runningJobsNames.map(name => <div>{name}</div>)}
                <h2>Tests in queue</h2>
                {queueNames.map(name => <div>{name}</div>)}
            </div>
        );
    }
}

export default Tests;

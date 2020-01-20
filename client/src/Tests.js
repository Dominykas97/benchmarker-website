import React, { Component } from "react";
let aa = [ { jobName: 'aa',
    pageLoadTime: '3',
    numberOfRequestsPerLoad: '200',
    memoryUsage: '5',
    pageSize: '3',
    numberOfRequests: '2',
    responseSize: '2',
    latency: '10',
    bandwidth: '1000',
    intervalBetweenRequests: '10' },
    { jobName: 'aaa',
        pageLoadTime: '3',
        numberOfRequestsPerLoad: '200',
        memoryUsage: '5',
        pageSize: '3',
        numberOfRequests: '2',
        responseSize: '2',
        latency: '10',
        bandwidth: '1000',
        intervalBetweenRequests: '10' } ];


class Tests extends Component {



    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({ data: res.data, runningJobs: res.runningJobs, queueJobs: res.queueJobs}))
            .catch(err => console.log(err));
        console.log("componentDidMount");
        // console.log(this.state.data);
    }

    async callBackendAPI() {
        const response = await fetch('/running_jobs');
        const body = await response.json();

        if(response.status !== 200) {

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
      let queueJobs = this.state.queueJobs;
      let queueJobsNames = [];
      for(let name in queueJobs){
          if(queueJobs.hasOwnProperty(name)){
              queueJobsNames.push(queueJobs[name].jobName);
          }
      }

      // let queueJobsNames = this.state.runningJobs;
      if (typeof queueJobsNames === 'undefined' || queueJobsNames.length === 0) {
          queueJobsNames = ["There are no jobs in the queue."];
      }
      // console.log(data);
      console.log(this.state.runningJobs);
      console.log(this.state.queueJobs);



    return (
      <div>
          <h2>Running tests</h2>
          {runningJobsNames.map(name => <div>{name}</div>)}
          <h2>Tests in queue</h2>
          {queueJobsNames.map(name => <div>{name}</div>)}
      </div>
    );
  }
}
 
export default Tests;

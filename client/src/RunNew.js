import React, {Component} from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';

class RunNew extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         // data: null,
    //         alerts: null
    //     };
    // }
    //
    // componentDidMount() {
    //     this.callBackendAPI()
    //         .then(res => this.setState({alerts: res.alerts}))
    //         .catch(err => console.log(err));
    //     console.log("componentDidMount");
    //     // console.log(this.state.data);
    // }
    //
    // async callBackendAPI() {
    //     const response = await fetch('/new_job');
    //     const body = await response.json();
    //
    //     if(response.status !== 200) {
    //
    //         throw Error(body.message)
    //     }
    //     // console.log(body[0]);
    //     console.log("callBackendAPI");
    //     console.log(body);
    //     return body;
    // }
    render() {
        return (
            <div class="container-fluid">
                <h2>Configuring a new test</h2>
                <Formik
                    initialValues={{
                        jobType: "job-appsimulator-flinksim-",
                        vbCarJobName: "123abc",
                        jobName: 'abc123',
                        pageLoadTime: '3',
                        numberOfRequestsPerLoad: '200',
                        memoryUsage: '5',
                        pageSize: '3',
                        numberOfRequests: '2',
                        responseSize: '2',
                        latency: '10',
                        bandwidth: '1000',
                        intervalBetweenRequests: '10'
                    }}
                    enableReinitialize={true}
                    validate={values => {
                        const errors = {};
                        // if (!values.pageLoadTime) {
                        //     errors.pageLoadTime = 'Required';
                        // } else if (
                        //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.pageLoadTime)
                        // ) {
                        //     errors.pageLoadTime = 'Invalid pageLoadTime address';
                        // }
                        return errors;
                    }}
                    onSubmit={(values) => {
                        setTimeout(() => {
                            fetch('/new_job', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(values)
                            });
                            // setSubmitting(false);
                        }, 400);
                    }}
                >

                    {props => (
                        <Form className="form-group">
                            {/*<div className="row justify-content-sm-start">*/}

                            <div className="row" id={"frm"}>
                                <label  className="col-1" htmlFor="jobType">Job type: </label>
                                {/*<div class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">*/}


                                    <Field class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="false" as="select" name="jobType">
                                        <option value="job-appsimulator-flinksim-">Appsimulator</option>
                                        <option value="job-vbcar-">Vbcar</option>
                                    </Field>
                                    <ErrorMessage name="jobType" component="div"/>
                                {/*</div>*/}
                            </div>
                            {props.values.jobType === "job-appsimulator-flinksim-" && (
                                <div>
                                    <div className="row" id={"frm"}>
                                        <label className="col-1" htmlFor="jobName">Job name: </label>
                                        <Field type="jobName" name="jobName"/>
                                        <ErrorMessage name="jobName" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="pageLoadTime">Page load time: </label>
                                        <Field type="pageLoadTime" name="pageLoadTime"/>
                                        <ErrorMessage name="pageLoadTime" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="numberOfRequestsPerLoad">Requests per load: </label>
                                        <Field type="numberOfRequestsPerLoad" name="numberOfRequestsPerLoad"/>
                                        <ErrorMessage name="numberOfRequestsPerLoad" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="memoryUsage">Memory usage: </label>
                                        <Field type="memoryUsage" name="memoryUsage"/>
                                        <ErrorMessage name="memoryUsage" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="pageSize">Page size: </label>
                                        <Field type="pageSize" name="pageSize"/>
                                        <ErrorMessage name="pageSize" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="numberOfRequests">Number of requests: </label>
                                        <Field type="numberOfRequests" name="numberOfRequests"/>
                                        <ErrorMessage name="numberOfRequests" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="responseSize">Response size: </label>
                                        <Field type="responseSize" name="responseSize"/>
                                        <ErrorMessage name="responseSize" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="latency">Latency: </label>
                                        <Field type="latency" name="latency"/>
                                        <ErrorMessage name="latency" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="bandwidth">Bandwidth: </label>
                                        <Field type="bandwidth" name="bandwidth"/>
                                        <ErrorMessage name="bandwidth" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="intervalBetweenRequests">Interval between requests: </label>
                                        <Field type="intervalBetweenRequests" name="intervalBetweenRequests"/>
                                        <ErrorMessage name="intervalBetweenRequests" component="div"/>
                                    </div>
                                </div>
                            )}
                            {props.values.jobType === "job-vbcar-" && (
                                <div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1"  htmlFor="vbCarJobName">Job name: </label>
                                        <Field type="vbCarJobName" name="vbCarJobName"/>
                                        <ErrorMessage name="vbCarJobName" component="div"/>
                                    </div>
                                </div>
                            )}

                            <button className="row" type="submit" class="btn-primary">
                                {/*// disabled={isSubmitting}>*/}
                                Run
                            </button>
                        </Form>
                    )}
                </Formik>
                {/*<form method='POST' action='/remove_job'>*/}
                {/*    <button>Remove</button>*/}
                {/*</form>*/}
            </div>
        )
    };
}

export default RunNew
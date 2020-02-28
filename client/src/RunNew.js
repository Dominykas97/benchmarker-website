import React, {Component} from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';

class RunNew extends Component {
    render() {
        return (
            <div className="container-fluid">
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
                            <div className="row" id={"frm"}>
                                <label className="col-1" htmlFor="jobType">Job type: </label>
                                <Field className="col-1 btn btn-secondary dropdown-toggle" data-toggle="dropdown"
                                       aria-haspopup="false" as="select" name="jobType">
                                    <option value="job-appsimulator-flinksim-">Appsimulator</option>
                                    <option value="job-vbcar-">Vbcar</option>
                                </Field>
                                <ErrorMessage name="jobType" component="div"/>
                            </div>
                            {props.values.jobType === "job-appsimulator-flinksim-" && (
                                <div>
                                    <div className="row" id={"frm"}>
                                        <label className="col-1" htmlFor="jobName">Job name: </label>
                                        <Field className="col-1" type="jobName" name="jobName"/>
                                        <ErrorMessage name="jobName" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="pageLoadTime">Page load time: </label>
                                        <Field className="col-1" type="pageLoadTime" name="pageLoadTime"/>
                                        <ErrorMessage name="pageLoadTime" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="numberOfRequestsPerLoad">Requests per
                                            load: </label>
                                        <Field className="col-1" type="numberOfRequestsPerLoad"
                                               name="numberOfRequestsPerLoad"/>
                                        <ErrorMessage name="numberOfRequestsPerLoad" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="memoryUsage">Memory usage: </label>
                                        <Field className="col-1" type="memoryUsage" name="memoryUsage"/>
                                        <ErrorMessage name="memoryUsage" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="pageSize">Page size: </label>
                                        <Field className="col-1" type="pageSize" name="pageSize"/>
                                        <ErrorMessage name="pageSize" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="numberOfRequests">Number of requests: </label>
                                        <Field className="col-1" type="numberOfRequests" name="numberOfRequests"/>
                                        <ErrorMessage name="numberOfRequests" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="responseSize">Response size: </label>
                                        <Field className="col-1" type="responseSize" name="responseSize"/>
                                        <ErrorMessage name="responseSize" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="latency">Latency: </label>
                                        <Field className="col-1" type="latency" name="latency"/>
                                        <ErrorMessage name="latency" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="bandwidth">Bandwidth: </label>
                                        <Field className="col-1" type="bandwidth" name="bandwidth"/>
                                        <ErrorMessage name="bandwidth" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="intervalBetweenRequests">Interval between
                                            requests: </label>
                                        <Field className="col-1" type="intervalBetweenRequests"
                                               name="intervalBetweenRequests"/>
                                        <ErrorMessage name="intervalBetweenRequests" component="div"/>
                                    </div>
                                </div>
                            )}
                            {props.values.jobType === "job-vbcar-" && (
                                <div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="vbCarJobName">Job name: </label>
                                        <Field className="col-1" type="vbCarJobName" name="vbCarJobName"/>
                                        <ErrorMessage name="vbCarJobName" component="div"/>
                                    </div>
                                    {/*<div className="row justify-content-sm-start" id={"frm"}>*/}
                                    {/*    <label className="col-1" htmlFor="vbCarModel">Model: </label>*/}
                                    {/*    /!*<Field type="vbCarModel" name="vbCarModel"/>*!/*/}
                                    {/*    <Field className="col-1 btn btn-secondary dropdown-toggle" data-toggle="dropdown"*/}
                                    {/*           aria-haspopup="false" as="select" name="vbCarModel">*/}
                                    {/*        /!*<option value=".*">everything</option>*!/*/}
                                    {/*        <option value="VBCAR">VBCAR</option>*/}
                                    {/*        <option value="Triple2vec">Triple2vec</option>*/}
                                    {/*        <option value="neumf">neumf</option>*/}
                                    {/*    </Field>*/}
                                    {/*    <ErrorMessage name="vbCarModel" component="div"/>*/}
                                    {/*</div>*/}
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="vbCarDataSet">Data Set: </label>
                                        {/*<Field type="vbCarDataSet" name="vbCarDataSet"/>*/}
                                        <Field className="col-1 btn btn-secondary dropdown-toggle"
                                               data-toggle="dropdown"
                                               aria-haspopup="false" as="select" name="vbCarDataSet">
                                            {/*<option value=".*">everything</option>*/}
                                            <option value="dunnhumby">dunn-humby</option>
                                            <option value="tafeng">tafeng</option>
                                        </Field>
                                        <ErrorMessage name="vbCarDataSet" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="vbCarEmbedSize">Embedding size: </label>
                                        {/*<Field type="vbCarEmbedSize" name="vbCarEmbedSize"/>*/}
                                        <Field className="col-1 btn btn-secondary dropdown-toggle"
                                               data-toggle="dropdown"
                                               aria-haspopup="false" as="select" name="vbCarEmbedSize">
                                            {/*<option value=".*">everything</option>*/}
                                            <option value="32">32</option>
                                            <option value="64">64</option>
                                            <option value="128">128</option>
                                            <option value="256">256</option>
                                            <option value="512">512</option>
                                        </Field>
                                        <ErrorMessage name="vbCarEmbedSize" component="div"/>
                                    </div>
                                    <div className="row justify-content-sm-start" id={"frm"}>
                                        <label className="col-1" htmlFor="vbCarDataSplit">Data split: </label>
                                        {/*<Field type="vbCarDataSplit" name="vbCarDataSplit"/>*/}
                                        <Field className="col-1 btn btn-secondary dropdown-toggle"
                                               data-toggle="dropdown"
                                               aria-haspopup="false" as="select" name="vbCarDataSplit">
                                            {/*<option value=".*">everything</option>*/}
                                            <option value="leave_one_item">leave_one_item</option>
                                            <option value="leave_one_basket">leave_one_basket</option>
                                            <option value="temporal">temporal</option>
                                        </Field>
                                        <ErrorMessage name="vbCarDataSplit" component="div"/>
                                    </div>
                                </div>
                            )}
                            <div className="row-cols-2">
                                <button className="col-1  justify-content-center btn btn-primary" type="submit" style={{marginTop: 20}}>
                                    Run
                                </button>
                            </div>
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
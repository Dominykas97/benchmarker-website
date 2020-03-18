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
                        jobName: 'abc123',
                        pageLoadTime: '3',
                        numberOfRequestsPerLoad: '200',
                        memoryUsage: '5',
                        pageSize: '3',
                        numberOfRequests: '2',
                        responseSize: '2',
                        latency: '10',
                        bandwidth: '1000',
                        intervalBetweenRequests: '10',
                        vbCarJobName: 'v123abc',
                        vbCarDataSet: 'dunnhumby',
                        vbCarEmbedSize: '32',
                        vbCarDataSplit: "leave_one_item",
                        triple2vecJobName: 't123abc',
                        triple2vecDataSet: 'dunnhumby',
                        triple2vecEmbedSize: '32',
                        triple2vecDataSplit: "leave_one_item",
                        neumfJobName: 'n123abc',
                        neumfDataSet: 'dunnhumby',
                        neumfEmbedSize: '32',
                        neumfDataSplit: "leave_one_item"
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
                                <label
                                    className="col-3 col-sm-2 col-md-2 col-lg-2 col-xl-1"
                                    htmlFor="jobType">Job type: </label>
                                {/*<div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">*/}
                                {/*    <div className="row">*/}
                                <Field
                                    className="col-3 col-md-2 btn btn-secondary dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-haspopup="false" as="select" name="jobType">
                                    <option value="job-appsimulator-flinksim-">Appsimulator</option>
                                    <option value="job-vbcar-">Vbcar</option>
                                    <option value="job-triple2vec-">Triple2vec</option>
                                    <option value="job-neumf-">neumf</option>
                                </Field>
                                <ErrorMessage name="jobType" component="div"/>
                                <div className="col-3 col-md-2 col-xl-1">
                                    <button
                                        className="col-12 justify-content-center btn btn-primary"
                                        type="submit">
                                        Run
                                    </button>
                                </div>
                                {/*</div>*/}

                                {/*</div>*/}

                            </div>
                            {props.values.jobType === "job-appsimulator-flinksim-" && (
                                <div>
                                    {/*<div className="row" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="jobName">Job
                                        name: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12 col-sm-12 col-md-12 col-lg-11 col-xl-10"
                                                   type="jobName" name="jobName"/>
                                            <ErrorMessage name="jobName" component="div"/>
                                            {/*<div className="col-4 col-lg-4 col-xl-3 justify-content-center table-secondary">?</div>*/}
                                        </div>
                                    </div>
                                    {/*<Field className="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2" type="jobName"*/}
                                    {/*       name="jobName"/>*/}
                                    {/*<ErrorMessage name="jobName" component="div"/>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="pageLoadTime">Page load time: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="pageLoadTime" name="pageLoadTime"/>
                                            <ErrorMessage name="pageLoadTime" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-center table-secondary">?
                                            </div>
                                        </div>
                                    </div>
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="numberOfRequestsPerLoad">Requests per load: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12 col-sm-12 col-md-12 col-lg-11 col-xl-10"
                                                   type="numberOfRequestsPerLoad" name="numberOfRequestsPerLoad"/>
                                            <ErrorMessage name="numberOfRequestsPerLoad" component="div"/>
                                            {/*<div className="col-4 col-lg-4 col-xl-3 justify-content-center table-secondary">?</div>*/}
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2"*/}
                                    {/*       type="numberOfRequestsPerLoad"*/}
                                    {/*       name="numberOfRequestsPerLoad"/>*/}
                                    {/*<ErrorMessage name="numberOfRequestsPerLoad" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">s</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="memoryUsage">Memory usage: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="memoryUsage" name="memoryUsage"/>
                                            <ErrorMessage name="memoryUsage" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">MB
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2" type="memoryUsage"*/}
                                    {/*       name="memoryUsage"/>*/}
                                    {/*<ErrorMessage name="memoryUsage" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">MB</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="pageSize">Page size: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="pageSize" name="pageSize"/>
                                            <ErrorMessage name="pageSize" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">?
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2" type="pageSize"*/}
                                    {/*       name="pageSize"/>*/}
                                    {/*<ErrorMessage name="pageSize" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">?</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="numberOfRequests">Number of requests: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12 col-sm-12 col-md-12 col-lg-11 col-xl-10"
                                                   type="numberOfRequests" name="numberOfRequests"/>
                                            <ErrorMessage name="numberOfRequests" component="div"/>
                                            {/*<div className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">?</div>*/}
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2"*/}
                                    {/*       type="numberOfRequests" name="numberOfRequests"/>*/}
                                    {/*<ErrorMessage name="numberOfRequests" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">s</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2"
                                        htmlFor="responseSize">Response size: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="responseSize" name="responseSize"/>
                                            <ErrorMessage name="responseSize" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">KB
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2" type="responseSize"*/}
                                    {/*       name="responseSize"/>*/}
                                    {/*<ErrorMessage name="responseSize" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">KB</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="latency">Latency: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="latency" name="latency"/>
                                            <ErrorMessage name="latency" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">ms
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2" type="latency"*/}
                                    {/*       name="latency"/>*/}
                                    {/*<ErrorMessage name="latency" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">ms</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="bandwidth">Bandwidth: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="bandwidth" name="bandwidth"/>
                                            <ErrorMessage name="bandwidth" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">Mbps
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2" type="bandwidth"*/}
                                    {/*       name="bandwidth"/>*/}
                                    {/*<ErrorMessage name="bandwidth" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">Mb/s</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                    <label
                                        // className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-1"
                                        htmlFor="intervalBetweenRequests">Interval between requests: </label>
                                    <div className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-8 col-lg-7" type="intervalBetweenRequests"
                                                   name="intervalBetweenRequests"/>
                                            <ErrorMessage name="intervalBetweenRequests" component="div"/>
                                            <div
                                                className="col-4 col-lg-4 col-xl-3 justify-content-end table-secondary">ms
                                            </div>
                                        </div>
                                    </div>
                                    {/*<Field className="col-6 col-sm-5 col-md-3 col-lg-2 col-xl-2"*/}
                                    {/*       type="intervalBetweenRequests"*/}
                                    {/*       name="intervalBetweenRequests"/>*/}
                                    {/*<ErrorMessage name="intervalBetweenRequests" component="div"/>*/}
                                    {/*<div className="input-group-append">*/}
                                    {/*    <span className="input-group-text">ms</span>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}
                                </div>
                            )}
                            {props.values.jobType === "job-vbcar-" && (
                                <div>
                                    <label
                                        htmlFor="vbCarJobName">Job name: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12" type="vbCarJobName"
                                                   name="vbCarJobName"/>
                                            <ErrorMessage name="vbCarJobName" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="vbCarDataSet">Data Set: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="vbCarDataSet">
                                                <option value="dunnhumby">dunnhumby</option>
                                                <option value="tafeng">tafeng</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="vbCarDataSet" component="div"/>
                                    </div>
                                    <label
                                        htmlFor="vbCarEmbedSize">Embedding size: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="vbCarEmbedSize">
                                                <option value="32">32</option>
                                                <option value="64">64</option>
                                                <option value="128">128</option>
                                                <option value="256">256</option>
                                                <option value="512">512</option>
                                            </Field>
                                            <ErrorMessage name="vbCarEmbedSize" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="vbCarDataSplit">Data split:</label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">

                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="vbCarDataSplit">
                                                <option value="leave_one_item">leave_one_item</option>
                                                <option value="leave_one_basket">leave_one_basket</option>
                                                <option value="temporal">temporal</option>
                                            </Field>
                                            <ErrorMessage name="vbCarDataSplit" component="div"/>
                                        </div>
                                    </div>
                                </div>
                                // <div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="vbCarJobName">Job name: </label>
                                //         <Field className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2" type="vbCarJobName"
                                //                name="vbCarJobName"/>
                                //         <ErrorMessage name="vbCarJobName" component="div"/>
                                //     </div>
                                //     {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                //     {/*    <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1" htmlFor="vbCarModel">Model: </label>*/}
                                //     {/*    /!*<Field type="vbCarModel" name="vbCarModel"/>*!/*/}
                                //     {/*    <Field className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 btn btn-secondary dropdown-toggle" data-toggle="dropdown"*/}
                                //     {/*           aria-haspopup="false" as="select" name="vbCarModel">*/}
                                //     {/*        /!*<option value=".*">everything</option>*!/*/}
                                //     {/*        <option value="VBCAR">VBCAR</option>*/}
                                //     {/*        <option value="Triple2vec">Triple2vec</option>*/}
                                //     {/*        <option value="neumf">neumf</option>*/}
                                //     {/*    </Field>*/}
                                //     {/*    <ErrorMessage name="vbCarModel" component="div"/>*/}
                                //     {/*</div>*/}
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="vbCarDataSet">Data Set: </label>
                                //         {/*<Field type="vbCarDataSet" name="vbCarDataSet"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="vbCarDataSet">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="dunnhumby">dunnhumby</option>
                                //             <option value="tafeng">tafeng</option>
                                //         </Field>
                                //         <ErrorMessage name="vbCarDataSet" component="div"/>
                                //     </div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="vbCarEmbedSize">Embedding size: </label>
                                //         {/*<Field type="vbCarEmbedSize" name="vbCarEmbedSize"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="vbCarEmbedSize">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="32">32</option>
                                //             <option value="64">64</option>
                                //             <option value="128">128</option>
                                //             <option value="256">256</option>
                                //             <option value="512">512</option>
                                //         </Field>
                                //         <ErrorMessage name="vbCarEmbedSize" component="div"/>
                                //     </div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="vbCarDataSplit">Data split: </label>
                                //         {/*<Field type="vbCarDataSplit" name="vbCarDataSplit"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="vbCarDataSplit">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="leave_one_item">leave_one_item</option>
                                //             <option value="leave_one_basket">leave_one_basket</option>
                                //             <option value="temporal">temporal</option>
                                //         </Field>
                                //         <ErrorMessage name="vbCarDataSplit" component="div"/>
                                //     </div>
                                // </div>
                            )}
                            {props.values.jobType === "job-triple2vec-" && (
                                <div>
                                    <label
                                        htmlFor="triple2vecJobName">Job name: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12" type="triple2vecJobName"
                                                   name="triple2vecJobName"/>
                                            <ErrorMessage name="triple2vecJobName" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="triple2vecDataSet">Data Set: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="triple2vecDataSet">
                                                <option value="dunnhumby">dunnhumby</option>
                                                <option value="tafeng">tafeng</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="triple2vecDataSet" component="div"/>
                                    </div>
                                    <label
                                        htmlFor="triple2vecEmbedSize">Embedding size: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="triple2vecEmbedSize">
                                                <option value="32">32</option>
                                                <option value="64">64</option>
                                                <option value="128">128</option>
                                                <option value="256">256</option>
                                                <option value="512">512</option>
                                            </Field>
                                            <ErrorMessage name="triple2vecEmbedSize" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="triple2vecDataSplit">Data split:</label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">

                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="triple2vecDataSplit">
                                                <option value="leave_one_item">leave_one_item</option>
                                                <option value="leave_one_basket">leave_one_basket</option>
                                                <option value="temporal">temporal</option>
                                            </Field>
                                            <ErrorMessage name="triple2vecDataSplit" component="div"/>
                                        </div>
                                    </div>
                                </div>
                                // <div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="triple2vecJobName">Job name: </label>
                                //         <Field className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2"
                                //                type="triple2vecJobName"
                                //                name="triple2vecJobName"/>
                                //         <ErrorMessage name="triple2vecJobName" component="div"/>
                                //     </div>
                                //     {/*<div className="row justify-content-xl-start" id={"frm"}>*/}
                                //     {/*    <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1" htmlFor="triple2vecModel">Model: </label>*/}
                                //     {/*    /!*<Field type="triple2vecModel" name="triple2vecModel"/>*!/*/}
                                //     {/*    <Field className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 btn btn-secondary dropdown-toggle" data-toggle="dropdown"*/}
                                //     {/*           aria-haspopup="false" as="select" name="triple2vecModel">*/}
                                //     {/*        /!*<option value=".*">everything</option>*!/*/}
                                //     {/*        <option value="triple2vec">triple2vec</option>*/}
                                //     {/*        <option value="Triple2vec">Triple2vec</option>*/}
                                //     {/*        <option value="neumf">neumf</option>*/}
                                //     {/*    </Field>*/}
                                //     {/*    <ErrorMessage name="triple2vecModel" component="div"/>*/}
                                //     {/*</div>*/}
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="triple2vecDataSet">Data Set: </label>
                                //         {/*<Field type="triple2vecDataSet" name="triple2vecDataSet"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="triple2vecDataSet">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="dunnhumby">dunnhumby</option>
                                //             <option value="tafeng">tafeng</option>
                                //         </Field>
                                //         <ErrorMessage name="triple2vecDataSet" component="div"/>
                                //     </div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="triple2vecEmbedSize">Embedding size: </label>
                                //         {/*<Field type="triple2vecEmbedSize" name="triple2vecEmbedSize"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="triple2vecEmbedSize">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="32">32</option>
                                //             <option value="64">64</option>
                                //             <option value="128">128</option>
                                //             <option value="256">256</option>
                                //             <option value="512">512</option>
                                //         </Field>
                                //         <ErrorMessage name="triple2vecEmbedSize" component="div"/>
                                //     </div>
                                //     <div className="row justify-content-xl-start" id={"frm"}>
                                //         <label className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1"
                                //                htmlFor="triple2vecDataSplit">Data split: </label>
                                //         {/*<Field type="triple2vecDataSplit" name="triple2vecDataSplit"/>*/}
                                //         <Field
                                //             className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2 btn btn-secondary dropdown-toggle"
                                //             data-toggle="dropdown"
                                //             aria-haspopup="false" as="select" name="triple2vecDataSplit">
                                //             {/*<option value=".*">everything</option>*/}
                                //             <option value="leave_one_item">leave_one_item</option>
                                //             <option value="leave_one_basket">leave_one_basket</option>
                                //             <option value="temporal">temporal</option>
                                //         </Field>
                                //         <ErrorMessage name="triple2vecDataSplit" component="div"/>
                                //     </div>
                                // </div>
                            )}
                            {props.values.jobType === "job-neumf-" && (
                                <div>
                                    <label
                                        htmlFor="neumfJobName">Job name: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field className="col-12" type="neumfJobName"
                                                   name="neumfJobName"/>
                                            <ErrorMessage name="neumfJobName" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="neumfDataSet">Data Set: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="neumfDataSet">
                                                <option value="dunnhumby">dunnhumby</option>
                                                <option value="tafeng">tafeng</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="neumfDataSet" component="div"/>
                                    </div>
                                    <label
                                        htmlFor="neumfEmbedSize">Embedding size: </label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">
                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="neumfEmbedSize">
                                                <option value="32">32</option>
                                                <option value="64">64</option>
                                                <option value="128">128</option>
                                                <option value="256">256</option>
                                                <option value="512">512</option>
                                            </Field>
                                            <ErrorMessage name="neumfEmbedSize" component="div"/>
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="neumfDataSplit">Data split:</label>
                                    <div className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                                        <div className="row">

                                            <Field
                                                className="col-12 btn btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="false" as="select" name="neumfDataSplit">
                                                <option value="leave_one_item">leave_one_item</option>
                                                <option value="leave_one_basket">leave_one_basket</option>
                                                <option value="temporal">temporal</option>
                                            </Field>
                                            <ErrorMessage name="neumfDataSplit" component="div"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/*<div className="row-cols-2">*/}
                            {/*    <button*/}
                            {/*        className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 justify-content-center btn btn-primary"*/}
                            {/*        type="submit" style={{marginTop: 20}}>*/}
                            {/*        Run*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </Form>
                    )}
                </Formik>
            </div>
        )
    };
}

export default RunNew
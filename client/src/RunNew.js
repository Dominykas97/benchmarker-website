import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';

const RunNew = () => (
    <div>
        <h2>Configuring a new test</h2>
        <Formik
            initialValues={{ jobName: 'abc123', pageLoadTime: '3', numberOfRequestsPerLoad: '200', memoryUsage: '5', pageSize:'3',
                numberOfRequests:'2', responseSize:'2', latency:'10', bandwidth:'1000', intervalBetweenRequests:'10'}}
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
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    // alert(JSON.stringify(values, null, 2));
                    // console.log(values);
                    // $.post("/new_job", values);
                    fetch('/new_job', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values)
                    });
                    setSubmitting(false);
                }, 400);
            }}
        >

            {({ isSubmitting }) => (
                <Form>
                    <div id={"frm"}>
                        <label htmlFor="jobName">Job name: </label>
                        <Field type="jobName" name="jobName" />
                        <ErrorMessage name="jobName" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="pageLoadTime">Page load time: </label>
                        <Field type="pageLoadTime" name="pageLoadTime" />
                        <ErrorMessage name="pageLoadTime" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="numberOfRequestsPerLoad">Number of request per load: </label>
                        <Field type="numberOfRequestsPerLoad" name="numberOfRequestsPerLoad" />
                        <ErrorMessage name="numberOfRequestsPerLoad" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="memoryUsage">Memory usage: </label>
                        <Field type="memoryUsage" name="memoryUsage" />
                        <ErrorMessage name="memoryUsage" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="pageSize">Page size: </label>
                        <Field type="pageSize" name="pageSize" />
                        <ErrorMessage name="pageSize" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="numberOfRequests">Number of requests: </label>
                        <Field type="numberOfRequests" name="numberOfRequests" />
                        <ErrorMessage name="numberOfRequests" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="responseSize">Response size: </label>
                        <Field type="responseSize" name="responseSize" />
                        <ErrorMessage name="responseSize" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="latency">Latency: </label>
                        <Field type="latency" name="latency" />
                        <ErrorMessage name="latency" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="bandwidth">Bandwidth: </label>
                        <Field type="bandwidth" name="bandwidth" />
                        <ErrorMessage name="bandwidth" component="div" />
                    </div>
                    <div id={"frm"}>
                        <label htmlFor="intervalBetweenRequests">Interval between requests: </label>
                        <Field type="intervalBetweenRequests" name="intervalBetweenRequests" />
                        <ErrorMessage name="intervalBetweenRequests" component="div" />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        Run
                    </button>
                </Form>
            )}
        </Formik>
        {/*<form method='POST' action='/remove_job'>*/}
        {/*    <button>Remove</button>*/}
        {/*</form>*/}
    </div>
);

export default RunNew;
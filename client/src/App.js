// import React, { Component } from "react";
// import {
//   Route,
//   NavLink,
//   HashRouter
// } from "react-router-dom";
// import Tests from "./Tests";
// import RunNew from "./RunNew";
// import Completed from "./Completed";
// import Login from "./Login";
// import LoginPage from "./LoginPage";
// 
// class App extends Component {
//   render() {
//     return (
//       <HashRouter>
//         <div>
//           {/*<h1>Simple SPA</h1>*/}
//           <ul className="header">
//             <li id="loadingDocks">LoadingDocks</li>
//             <li><NavLink exact to="/">Tests</NavLink></li>
//             <li><NavLink to="/new">Run new tests</NavLink></li>
//             <li><NavLink to="/completed">Completed</NavLink></li>
//             {/*<li><NavLink to="/login">Login</NavLink></li>*/}
//           </ul>
//           <div className="content">
//             <Route exact path="/" component={Tests}/>
//             <Route path="/new" component={RunNew}/>
//             <Route path="/completed" component={Completed}/>
//             {/*<Route path="/login" component={LoginPage}/>*/}
//           </div>
//         </div>
//       </HashRouter>
//     );
//   }
// }
//  
// export default App;


import React, {Component} from 'react';
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";


// import logo from './logo.svg';
// import './App.css';


import Tests from "./Tests";
import RunNew from "./RunNew";
import Completed from "./Completed";


// import Login from "./Login";
// import LoginPage from "./LoginPage";
// const fs = require('fs');
// const express = require('express');

// var host = process.env.COMPONENT_BACKEND_HOST || '0.0.0.0';
// var port = process.env.COMPONENT_BACKEND_PORT || 8080;
// 
// console.warn(host, port);

class App extends Component {
    state = {
        data: null
    };

    componentDidMount() {
        // Call our fetch function below once the component mounts
        this.callBackendAPI()
            .then(res => this.setState({data: res.express}))
            .catch(err => console.log(err));
    }

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    render() {
        return (
            <HashRouter>
                <div>
                    {/*<h1>Simple SPA</h1>*/}
                    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
                        <a className="navbar-brand">LoadingDocks</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                {/*<a className="nav-item nav-link active">Home <span*/}
                                {/*    className="sr-only">(current)</span></a>*/}
                                <NavLink exact to="/" className="nav-item nav-link">Running tests</NavLink>
                                <NavLink to="/new" className="nav-item nav-link">Run new tests</NavLink>
                                <NavLink to="/completed" className="nav-item nav-link">Completed</NavLink>
                                <NavLink to="/" className="nav-item nav-link">{this.state.data}</NavLink>
                                {/*<a className="nav-item nav-link disabled" href="#">Disabled</a>*/}
                            </div>
                        </div>
                    </nav>
                    {/*<ul className="panel-heading">*/}
                    {/*    <li id="loadingDocks">LoadingDocks</li>*/}
                    {/*    <NavLink exact to="/">Tests</NavLink>*/}
                    {/*    <NavLink to="/new">Run new tests</NavLink>*/}
                    {/*    <NavLink to="/completed">Completed</NavLink>*/}
                    {/*    <NavLink to="/">{this.state.data}</NavLink>*/}
                    {/*    /!*<li><NavLink to="/login">Login</NavLink></li>*!/*/}
                    {/*</ul>*/}
                    <div className="content">
                        <Route exact path="/" component={Tests}/>
                        <Route path="/new" component={RunNew}/>
                        <Route path="/completed" component={Completed}/>
                        {/*<Route path="/login" component={LoginPage}/>*/}
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;

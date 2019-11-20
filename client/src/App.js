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


import React, { Component } from 'react';
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
    console.warn("a");
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
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
          <ul className="header">
            <li id="loadingDocks">LoadingDocks</li>
            <li><NavLink exact to="/">Tests</NavLink></li>
            <li><NavLink to="/new">Run new tests</NavLink></li>
            <li><NavLink to="/completed">{this.state.data}</NavLink></li>
            {/*<li><NavLink to="/login">Login</NavLink></li>*/}
          </ul>
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




{/*<div className="App">*/}
{/*<header className="App-header">*/}
{/*  <h1 className="App-title">Welcome to React</h1>*/}
{/*</header>*/}
{/*//Render the newly fetched data inside of this.state.data*/}
{/*<p className="App-intro">{this.state.data}</p>*/}
{/*</div>*/}
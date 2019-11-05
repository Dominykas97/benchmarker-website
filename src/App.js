import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Tests from "./Tests";
import RunNew from "./RunNew";
import Completed from "./Completed";
// import Login from "./Login";
// import LoginPage from "./LoginPage";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          {/*<h1>Simple SPA</h1>*/}
          <ul className="header">
            <li id="loadingDocks">LoadingDocks</li>
            <li><NavLink exact to="/">Tests</NavLink></li>
            <li><NavLink to="/new">Run new tests</NavLink></li>
            <li><NavLink to="/completed">Completed</NavLink></li>
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

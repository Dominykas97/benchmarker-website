import React, {Component} from 'react';
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

import Tests from "./Tests";
import RunNew from "./RunNew";
import Completed from "./Completed";

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
                    <nav className="navbar navbar-expand navbar-light bg-primary">
                        <a className="navbar-brand">LoadingDocks</a>
                        <div className="navbar-nav">
                            <NavLink exact to="/" className="nav-item nav-link">Running tests</NavLink>
                            <NavLink to="/new" className="nav-item nav-link">Run new tests</NavLink>
                            <NavLink to="/completed" className="nav-item nav-link">Completed</NavLink>
                        </div>
                    </nav>
                    <div className="content">
                        <Route exact path="/" component={Tests}/>
                        <Route path="/new" component={RunNew}/>
                        <Route path="/completed" component={Completed}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;

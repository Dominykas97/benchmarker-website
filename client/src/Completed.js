import React, {Component} from "react";

class Completed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            podsNames: null
            // color: 'white',
            // selected: 0
            // ClickedButton: ''
        };
        // this.state = {buttonstate: false};
        // this.handleClick = e => {
        //     e.preventDefault();
        //
        //     this.setState({buttonstate: !this.state.buttonstate});
        // };
    }

    // handleChange(id) {
    //
    //     this.setState({ClickedButton: id});
    //     this.props.selectedtype.bind(this, id)();
    //
    // }
    // changeColor(index) {
    //     this.setState({ activeIndex: index })
    //     let newColor = this.state.color === 'white' ? 'orange' : 'white';
    //     this.setState({color: newColor});
    //     // this.handleClick = this.handleClick.bind(this)
    // }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({data: res.data, jobsNames: res.jobsNames, podsNames: res.podsNames}))
            .catch(err => console.log(err));
        // console.log("componentDidMount");
        // console.log(this.state.data);
    }

    async callBackendAPI() {
        const response = await fetch('/completed_jobs');
        const body = await response.json();

        if (response.status !== 200) {

            throw Error(body.message)
        }
        // console.log(body[0]);
        // console.log("callBackendAPI");
        console.log(body);
        return body;
    }

    toggleSelected = (name) => {
        console.log(name);
        this.setState({selectedItemIndex: name});
    };

    render() {
        let podName = this.state.podsNames || "";
        let sourceCpu = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=0";
        let sourceMemory = "https://grafana-openshift-monitoring.ida.dcs.gla.ac.uk/d-solo/6581e46e4e5c7ba40a07646395ef7b23/k8s-compute-resources-pod?refresh=10s&orgId=1&var-datasource=prometheus&var-namespace=2262804sproject&var-pod="
            + podName[this.state.selectedItemIndex] + "&panelId=2";
        let data = this.state.data || 'there is no data';
        let names = this.state.jobsNames;
        if (typeof names === 'undefined' || names.length === 0) {
            names = ["There are no completed jobs."]
        }
        console.log(this.state);
        console.log(this.state.jobsNames);
        console.log(podName["job-appsimulator-flinksim-a2"]);
        // let names = Object;
        if (data !== 'there is no data') {
            console.log(data);
            // console.log(data.body.items[0].metadata.name);
            // names = data.body.items
        }
        return (
            <div class="container-fluid">
                {/*<div className="leftSide">*/}
                <div class="row justify-content-sm-start">
                    <div class="col-4">
                        <h2>Completed tests</h2>
                        {names.map(name => <div>
                            {/*<button key={name}*/}
                            <div class="btn-group-vertical">

                                <button type="button" class="btn btn-secondary" key={name}
                                        onClick={() => this.toggleSelected(name)}
                                    // style={this.state.selectedItemIndex === name ? {background: 'orange'} : {background: 'white'}}
                                    // style={this.props.active ? 'orange' : 'white'}
                                    // style={{background: this.state.color}}
                                    // onClick={this.changeColor.bind(null, this)}
                                    // onClick={this.props.onToggle}
                                >{name}</button>
                            </div>

                        </div>)}
                    </div>
                    <div class="col-8">
                        <ul>
                            <iframe title={"cpu"} src={sourceCpu} width="600" height="350" frameBorder="0"/>
                        </ul>
                        <ul>
                            <iframe title={"memory"} src={sourceMemory} width="600" height="350" frameBorder="0"/>
                        </ul>
                    </div>

                    {/*</div>*/}
                    {/*<div className="graphs">*/}
                    {/*    <ul>*/}
                    {/*        <iframe title={"cpu"} src={sourceCpu} width="600" height="350" frameBorder="0"/>*/}
                    {/*    </ul>*/}
                    {/*    <ul>*/}
                    {/*        <iframe title={"memory"} src={sourceMemory} width="600" height="350" frameBorder="0"/>*/}
                    {/*    </ul>*/}
                </div>
            </div>

        );
    }
}

export default Completed;


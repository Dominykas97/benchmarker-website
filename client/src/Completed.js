import React, {Component} from "react";

class Completed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({ data: res.data, jobsNames: res.jobsNames}))
            .catch(err => console.log(err));
        console.log("componentDidMount");
        // console.log(this.state.data);
    }

    async callBackendAPI() {
        const response = await fetch('/completed_jobs');
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
        let data = this.state.data || 'there is no data';
        let names = this.state.jobsNames || ["There are no completed jobs."];
        console.log(data);
        console.log(this.state.jobsNames);
        // let names = Object;
        if(data !== 'there is no data'){
            console.log(data);
            // console.log(data.body.items[0].metadata.name);
            // names = data.body.items
        }
        return (
            <div className="body">

              <div className="leftSide">
                <h2>Completed tests</h2>
                {/*<p className="App-intro">{data[0]}</p>*/}
                  {/*<div>*/}
                  {/*    {data.objects.map((item, index) => (*/}
                  {/*        <Item key={index} item={item} />*/}
                  {/*    ))}*/}
                  {/*</div>*/}
                  {names.map(name => <div>{name}</div>)}

              </div>
                {/*</div>*/}

                {/*// <div>*/}
                <div className="graphs">
                  <ul>
                    <iframe
                        src="https://snapshot.raintank.io/dashboard-solo/snapshot/z6kkrYtaDcRasUsCE5eCWoKShc2YWnAl?orgId=2&panelId=0&from=1572980548597&to=1572984148597&var-datasource=&var-namespace=2262804sproject"
                        width="600" height="300" frameBorder="0"/>
                  </ul>
                  <ul>
                    <iframe
                        src="https://snapshot.raintank.io/dashboard-solo/snapshot/z6kkrYtaDcRasUsCE5eCWoKShc2YWnAl?orgId=2&panelId=2&from=1572980548597&to=1572984148597&var-datasource=&var-namespace=2262804sproject"
                        width="600" height="300" frameBorder="0"/>
                  </ul>
                </div>
            </div>

        );
    }
}

export default Completed;

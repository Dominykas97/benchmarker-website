import React, {Component} from "react";

class Completed extends Component {
    render() {
        return (
            <div className="body">

              <div className="leftSide">
                <h2>Completed tests</h2>
                <p>c1</p>
                <p>c2</p>
                <p>c3</p>
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

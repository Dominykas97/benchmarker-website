import React, { Component } from "react";
 
class RunNew extends Component {
  render() {
    return (
      <div>
        <h2>Configure a new test</h2>
          <form method='POST' action='/new_job'>
              <button>Run</button>
          </form>

          <form method='POST' action='/remove_job'>
              <button>Remove</button>
          </form>
          {/*<button*/}
        {/*    className="btn btn-default"*/}
        {/*    // style={buttonStyle}*/}
        {/*    // onClick={createNewJob()}*/}
        {/*>{"Run new"}*/}
        {/*</button>*/}
      </div>
    );
  }
}
 
export default RunNew;

import React, { Component } from "react";
 
class RunNew extends Component {
  render() {
    return (
      <div>
        <h2>Configure a new test</h2>
        <button
            className="btn btn-default"
            // style={buttonStyle}
            // onClick={createNewJob()}
        >{"Run new"}
        </button>
      </div>
    );
  }
}
 
export default RunNew;

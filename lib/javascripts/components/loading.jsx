import React from "react";
import '../../stylesheets/loading.scss';


export default class Loading extends React.Component {
  render() {
    return (
      <div className="loading ng-scope">
        <div style={{width: '100%', height: '100%'}} className="loading__rolling">
          <div></div>
        </div>
      </div>
    );
  }
}

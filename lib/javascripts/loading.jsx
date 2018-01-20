import React from "react";
import '../stylesheets/loading.scss';


export default class Loading extends React.Component {
  render() {
    return (
      <div className={"loading"}>
        <svg className={"dots-loader"} width="32" height="8" viewBox="0 0 16 4">
          <circle cx="14" cy="2" r="2"></circle>
          <circle cx="8" cy="2" r="2"></circle>
          <circle cx="2" cy="2" r="2"></circle>
        </svg>
      </div>
    );
  }
}

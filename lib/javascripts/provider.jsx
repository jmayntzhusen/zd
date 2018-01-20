import React from 'react';
import '../stylesheets/provider.scss';

export default class Provider extends React.Component {
  render() {
    return (
      <div id="provider">
        <small>Provided by <a href="https://helphouse.io/" target="_blank">helpHouse.io</a></small>
      </div>
    )
  }
}

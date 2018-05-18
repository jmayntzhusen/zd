import React from 'react';

export default class ResultItem extends React.Component {
  render() {
    return (
      <li className="result-item">
        <a className="result-item__wrap" href={this.props.href} target="_blank">
          <span className="result-item__label result-item__label--category">{this.props.category}</span>
          <span className="result-item__label result-item__label--name">{this.props.name}</span>
        </a>
      </li>
    );
  }
}

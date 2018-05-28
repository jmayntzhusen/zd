import React from 'react';
import {connect} from 'react-redux';
import {setArticlePath} from '../actions/path';

class ResultItem extends React.Component {
  render() {
    return (
      <li className="result-item">
        <a className="result-item__wrap" onClick={() => this.handleClick(this.props.url)}>
          <span className="result-item__label result-item__label--category">{this.props.category}</span>
          <span className="result-item__label result-item__label--name">{this.props.name}</span>
        </a>
      </li>
    );
  }

  async handleClick(path) {
    console.log(path);
    this.props.app.create_instance().then(() => {
      console.log('this is the path', path);
      this.props.setArticlePath(path);
    });
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setArticlePath: (path) => dispatch(setArticlePath(path))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultItem);


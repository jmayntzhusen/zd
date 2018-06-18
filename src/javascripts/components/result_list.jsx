import React from 'react';
import {connect} from 'react-redux';
import ResultItem from './result_item';

class ResultList extends React.Component {
  render() {
    return (
      <ul ref="resultList" className="result-list">
        {this.renderItems(this.props.currentCategory)}
      </ul>
    );
  }

  renderItems(currentCategory) {
    return this.props.result.map(item => {
      if(currentCategory !== 'all') {
        if(currentCategory === item.category) {
          return <ResultItem url={item.url} name={item.name} category={item.category}/>
        } else {
          return null;
        }
      }

      return <ResultItem url={item.url} name={item.name} category={item.category}/>
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.result !== this.props.result) {
      this.refs.resultList.scrollTop = 0;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    result: state.result,
    currentCategory: state.currentCategory
  }
};

export default connect(mapStateToProps)(ResultList);

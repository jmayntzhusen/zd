import React from 'react';
import {connect} from 'react-redux';
import ResultItem from './result_item';

class ResultList extends React.Component {
  render() {
    console.log(this.props.result);
   return (
     <ul className="result-list">
      {this.props.result.map(item => {
        return <ResultItem url={item.url} name={item.name} category={item.category}/>
      })}
    </ul>
   );
  }
}

const mapStateToProps = (state) => {
  return {
    result: state.result
  }
};

export default connect(mapStateToProps)(ResultList);

import React from 'react';
import {connect} from 'react-redux';
import Search from './components/search';
import ResultList from './components/result_list';
import Info from './components/info';
import {setPath} from './actions/path';

class SidebarBase extends React.Component {
  render() {
    return [
      <Info />,
      <Search/>,
      this.props.result !== null
        ? <ResultList/>
        : null
    ];
  }

  componentDidMount() {
    this.getPath();
  }

  async getPath() {
    const ticket = await this.props.app.client.get('ticket');
    let path     = ticket.ticket.subject.split('(From: ');

    path = path[1].split(')');
    path = path[0].split('/');

    let result = [];

    path.forEach(item => {
      if(item.length) {
        result.push(item);
      }
    });

    this.props.setPath(result);
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
    result: state.result
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPath: (path) => dispatch(setPath(path))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarBase);

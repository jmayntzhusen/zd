import React from 'react';
import {connect} from 'react-redux';
import Search from './components/search';

class SidebarBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Search/>;
  }

  async componentDidMount() {
    console.log(await this.props.app.umbraco.search('umbraco'));
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
};

export default connect(mapStateToProps)(SidebarBase);

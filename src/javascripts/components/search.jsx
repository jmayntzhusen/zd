import React from 'react';
import {gettext as _} from '../../../lib/javascripts/utils/i18n';
import {connect} from 'react-redux';
import {setResult} from '../actions/result';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this['state']         = {};
    this.state['term']    = '';
    this.state['error']   = false;
    this.state['message'] = null;
  }


  render() {
    console.log(this.props, this.state);
    return (
      <form className={'search'} onSubmit={(e) => this.handleSubmit(e)}>
        <input id={'term'} value={this.state.term} onChange={(e) => this.handleChange(e)} className={'search__input'} type={'text'}/>
        <button className={'search__button'} type={'submit'}>{_('Search')}</button>
        {this.state.error
          ? <small>{this.state.message}</small>
          : null}
      </form>
    )
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = await this.props.app.umbraco.search(this.state.term);
    const resp = data.response;

    if(resp === 400) {
      this.setState({
        error: true,
        message: data.message
      });
    }
    else if(resp === 200) {
      console.log(data);
      this.setState({
        error: false,
        message: null
      });

      this.props.setResult(data.data);
    }
  }

  handleChange(e) {
    if(e.target.id === 'term') {
      this.setState({
        term: e.target.value
      });
    }
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
    setResult: (result) => dispatch(setResult(result))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

import React from 'react';
import {gettext as _} from '../../../lib/javascripts/utils/i18n';
import {connect} from 'react-redux';
import {setResult} from '../actions/result';
import Loading from '../../../lib/javascripts/components/loading';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this['state']           = {};
    this.state['term']      = '';
    this.state['error']     = false;
    this.state['message']   = null;
    this.state['isLoading'] = false;
  }


  render() {
    const isEnabled = this.state.term.length > 3;
    console.log('testing', this.state.term.length > 3);
    console.log('Is it enabled?', !isEnabled);

    return (
      <form className={'search'} onSubmit={(e) => this.handleSubmit(e)}>
        <input id={'term'} value={this.state.term} onChange={(e) => this.handleChange(e)} className={'search__input'} type={'text'}/>
        {!this.state.isLoading
          ? <button disabled={!isEnabled} className={'search__button' + (!isEnabled ? ' search__button--disabled' : '')} type={'submit'}>{_('Search')}</button>
          : (
            <div className="search__button search__button--is-loading">
              <Loading/>
            </div>
          )
        }
        {this.state.error &&
          <small className="search__message">{this.state.message}</small>}
      </form>
    )
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({isLoading: true});

    //const data = await this.props.app.umbraco.Articles.search(this.state.term);
    const data = await this.props.app.umbraco.search(this.state.term);
    const resp = data.response;

    if(resp === 400 || resp === 404) {
      this.setState({
        error: true,
        message: data.message
      });
    } else if(resp === 200) {
      this.setState({
        error: false,
        message: null
      });

      this.props.setResult(data.data);
    }

    this.setState({isLoading: false});
  }

  handleChange(e) {
    if(e.target.id === 'term') {
      this.setState({term: e.target.value});
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

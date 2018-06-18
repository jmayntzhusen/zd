import React from 'react';
import {gettext as _} from '../../../lib/javascripts/utils/i18n';

const marked = require('marked');

export default class Markdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.source);
    return (
      <React.Fragment>
        <form className={'search'} onSubmit={(e) => this.handleSubmit(e)}>
          <input value={this.props.source.ourUrl} onChange={(e) => this.handleChange(e)} className={'search__input'} type={'text'}/>
          <button className={'search__button'} type={'submit'}>{_('Copy')}</button>
        </form>
        <div id="markdown">
          <div dangerouslySetInnerHTML={{__html: marked(this.props.source.data)}}></div>
        </div>
      </React.Fragment>
    );
  }
}

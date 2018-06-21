import React from 'react';
import {gettext as _} from '../../../lib/javascripts/utils/i18n';

const marked = require('marked');

export default class Markdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <form className={'search u-mb'}>
          <input id={'our-url'} value={this.props.source.ourUrl} className={'search__input'} type={'text'}/>
          <button className={'search__button'} onClick={(e) => this.handleClick(e)}>{_('Copy')}</button>
        </form>
        <div id="markdown">
          <div dangerouslySetInnerHTML={{__html: marked(this.props.source.data)}}></div>
        </div>
      </React.Fragment>
    );
  }

  handleClick(e) {
    e.preventDefault();

    const url = document.querySelector('#our-url');
    url.select();
    document.execCommand('copy');
  }
}

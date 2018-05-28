import React from 'react';

const marked = require('marked');

export default class Markdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="markdown">
        <div dangerouslySetInnerHTML={{__html: marked(this.props.source)}}></div>
      </div>
    );
  }
}

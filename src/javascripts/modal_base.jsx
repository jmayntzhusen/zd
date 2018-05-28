import React from 'react';
import {connect} from 'react-redux';
import Loading from '../../lib/javascripts/components/loading';
import Markdown from './components/markdown';


class ModalBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state['markdown'] = null;
    this.state['ourUrl']   = null;
  }

  render() {
    console.log(this.state.markdown);
    return this.state.markdown
      ? <Markdown source={this.state.markdown.data}/>
      : <Loading/>;
  }

  async componentWillReceiveProps(nextProps) {
    if(nextProps.articlePath !== this.props.articlePath) {
      const article = await this.props.app.umbraco.getArticleByPath(nextProps.articlePath);

      this.setState({markdown: article});
    }
  }
}

const mapStateToProps = (state) => {
  return {
    articlePath: state.articlePath,
    app: state.app
  }
};

export default connect(mapStateToProps)(ModalBase);

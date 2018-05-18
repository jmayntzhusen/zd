import React from 'react';
import {connect} from 'react-redux';
import {gettext as _} from '../../../lib/javascripts/utils/i18n';

class Info extends React.Component {
  render() {
    return this.props.path
      ? (
        <ul className="info">
          <h1 class="info__title">User path</h1>
          {this.props.path.map(item => (
            <li className="info__item">{item}</li>
          ))}
        </ul>
      )
      : null;
  }
}

const mapStateToProps = (state) => {
  return {
    path: state.path
  }
};

export default connect(mapStateToProps)(Info);

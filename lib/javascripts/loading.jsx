import React from "react";
import {gettext as _} from 'i18n';

import '../stylesheets/loading.scss';
import img_spinner from '../assets/spinner.gif';


export default class Loading extends React.Component {
  render() {
    return (
      <div id="loading">
        <img src={img_spinner} alt={_('Loading')} id="spinner" />
      </div>
    );
  }
}

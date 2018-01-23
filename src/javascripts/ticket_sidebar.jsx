import App from 'app';
import React from 'react';
import {gettext as _} from "utils/i18n";
import T from 'components/i18n';
import ProvidedBy from 'components/provided_by';
import Loading from "components/loading";
//import classNames from 'classnames';

export default class SeedApp extends App {
  render() {
    // Return react components
    return [
      <Loading/>,
      <ProvidedBy/>,
    ]
  }
}

import App from 'app';
import React from 'react';
import {T, gettext as _} from 'i18n';
import Provider from 'provider';
import Loading from "../../lib/javascripts/loading";

/**
 * ClassNames Helper
 *
 * See https://www.npmjs.com/package/classnames
 */
//import classNames from 'classnames';

export default class SeedApp extends App {
  render() {
    // Return react components
    return [
      <Loading/>,
      <Provider/>,
    ]
  }
}

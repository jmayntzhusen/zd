import App from 'app';
import React from 'react';
import {T} from 'i18n';
import Provider from 'provider';

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
      <p>It works!</p>,
      <Provider/>,
    ]
  }
}

import App from 'app';
import React from 'react';
// import {gettext as _} from "utils/i18n";
// import T from 'components/i18n';
import ProvidedBy from 'components/provided_by';
import Loading from "components/loading";
import SidebarBase from './sidebar_base';
import {resultReducer} from './reducers/result';
// import { Tabs, Tab} from "components/tabs";
// import {tabsActiveReducer} from "reducers/tabs";
// import classNames from 'classnames';


export default class SeedApp extends App {
  get_reducers() {
    return Object.assign(super.get_reducers(), {
      result: resultReducer
    });
  }

  render() {
    // Return react components
    return (
      <React.Fragment>
        <SidebarBase/>
        <ProvidedBy/>
      </React.Fragment>
    )
  }
}

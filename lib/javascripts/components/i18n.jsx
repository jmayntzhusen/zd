import {gettext as _} from "utils/i18n";
import React from "react";


export default class T extends React.Component {
  constructor(props) {
    super(props);

    this._key = this.props.var || this.props.children;
  }

  render() {
    return _(this._key)
  }
}

import App from 'app';
import React from 'react';
import {articlePathReducer} from './reducers/path';
import ModalBase from './modal_base';


export default class TicketSidebar extends App {
  default_width  = '70vw';
  default_height = '70vh';

  get_reducers() {
    return Object.assign(super.get_reducers(), {
      articlePath: articlePathReducer
    });
  }

  render() {
    return (
      <React.Fragment>
        <ModalBase />
      </React.Fragment>
    )
  }
}

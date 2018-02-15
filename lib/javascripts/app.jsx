//import StorageLocal from 'storage/local';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { setApp } from "./actions/app";
import { appReducer } from "./reducers/app";


export default class App {
  constructor(client, app_data, user) {
    this.client = client;
    this.user = user;
    this.app_data = app_data;
    this.metadata = app_data.metadata;
    this.context = app_data.context;
    this.store = this.get_store();

    this.store.dispatch(setApp(this));

    //this.storage = new StorageLocal(this.metadata.installationId);

    this.main();
  }

  get_store(...args) {
    return createStore(
      this.get_root_reducer(),
      ...args,
    );
  }

  get_root_reducer() {
    return combineReducers(this.get_reducers());
  }

  get_reducers() {
    return { app: appReducer };
  }

  resize_viewport(width, height) {
    if(!width) {
      width = '100%';
    }

    if(!height) {
      height = document.getElementsByTagName('main')[0].offsetHeight;
    }

    if(width || height) {
      let resize = {};

      if(width) {
        resize['width'] = width;
      }

      if(height) {
        resize['height'] = height;
      }

      this.client.invoke('resize', resize);
    }
    else {
      console.error("resize failed!");
    }
  }

  main() {
    this.store.subscribe(() => {
      setTimeout(() => {
        // Push resize behind the render queue
        this.resize_viewport();
      }, 1);
    });

    render(
      <Provider store={this.store}>
        {this.render()}
      </Provider>,
      document.getElementsByTagName('main')[0],
    );
  }

  render() {
    throw new Error(`Please define render() method on ${this.constructor.name} class`);
  }
}

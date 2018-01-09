//import Storage from 'storage';
import React from 'react';
import {render} from 'react-dom';

export default class App {
  constructor(client, app_data, user) {
    this.client = client;
    this.user = user;
    this._app_data = app_data;
    this.metadata = app_data.metadata;
    this.context = app_data.context;

    //this.storage = new Storage(this.metadata.installationId);

    this.main();
  }

  resize_viewport(width, height) {
    if(!width) {
      width = '100%';
    }

    if(!height) {
      let body = document.body,
          html = document.documentElement;

      // height = Math.max( body.scrollHeight, body.offsetHeight,
      //   html.clientHeight, html.scrollHeight, html.offsetHeight);
      height = Math.max(body.offsetHeight, html.offsetHeight);
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
    window.addEventListener('resize', () => { this.resize_viewport(); });

    render(this.render(), document.getElementsByTagName('main')[0]);
  }

  render() {
    throw new Error(`Please define render() method on ${this.constructor.name} class`);
  }
}

//import StorageLocal from 'storage/local';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { setApp } from "./actions/app";
import { appReducer } from "./reducers/app";
import {instance_dispatcher_middleware} from "./middleware/instance_dispatcher";


export default class App {
  action_routes = null;
  default_width = '100%';
  default_height = null;

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

  get_store(initial_values) {
    return createStore(
      this.get_root_reducer(),
      this.get_initial_values(initial_values),
      applyMiddleware(...this.get_middlewares()),
    );
  }

  get_root_reducer() {
    return combineReducers(this.get_reducers());
  }

  get_reducers() {
    return { app: appReducer };
  }

  get_initial_values(initial_values) {
    return initial_values;
  }

  get_middlewares() {
    return [instance_dispatcher_middleware(this)];
  }

  get_action_routes(action_routes) {
    return action_routes || {};
  }

  resize_viewport(width, height) {
    if(!width) {
      width = this.default_width;
    }

    if(!height) {
      height = this.default_height || document.getElementsByTagName('main')[0].offsetHeight;
    }

    if(width || height) {
      let resize = {};

      if(width) {
        resize.width = width;
      }

      if(height) {
        resize.height = height;
      }

      this.client.invoke('resize', resize);
    }
    else {
      console.error("resize failed!");
    }
  }

  create_instance(location='modal', url='assets/index.html') {
    return this.client.invoke('instances.create', {
      location: location,
      url: url,
    }).then(response => {
      let context = response['instances.create'][0];

      return this.client.instance(context.instanceGuid);
    });
  }

  main() {
    this.client.on('instance.created', (context) => {
      /**
       * Map dispatcher across instances
       */
      let instance = this.client.instance(context.instanceGuid);

      if(typeof instance.dispatch === 'undefined') {
        instance._before_render = false;

        instance.on('app.render.before', () => {
          instance._before_render = true;
        });

        function dispatch(action) {
          const _f = () => {
            if (this._before_render) {
              this.trigger('redux.dispatch', action);

              clearInterval(_I);
            }
          };

          let _I = setInterval(_f, 10);

          _f();
        }

        instance.dispatch = dispatch.bind(instance);
      }
    });

    this.client.on('redux.dispatch', (action) => {
      this.store.dispatch(action);
    });

    this.store.subscribe(() => {
      setTimeout(() => {
        // Push resize behind the render queue
        this.resize_viewport();
      }, 1);
    });

    this.client.trigger('app.render.before');

    render(
      <Provider store={this.store}>
        {this.render()}
      </Provider>,
      document.getElementsByTagName('main')[0],
    );

    this.client.trigger('app.render.after');

    this.resize_viewport();
  }

  render() {
    throw new Error(`Please define render() method on ${this.constructor.name} class`);
  }
}

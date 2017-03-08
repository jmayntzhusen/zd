import View from 'view';

class AppBase {
  constructor(client, app_data, user) {
    let self = this;

    this.client = client;
    this.user = user;
    this._app_data = app_data;
    this._metadata = app_data.metadata;
    this._context = app_data.context;

    this.view = new View({
      post_render: () => self.post_render.bind(self)(),
      pre_render: () => self.pre_render.bind(self)(),
    });

    this.render_loading();

    this.render_main();
  }

  pre_render(name, data) {
    // Emtpy method
  }

  post_render(name, render) {
    this.resize_viewport();
  }

  resize_viewport(width, height) {
    if(!width) {
      width = '100%';
    }

    if(!height) {
      let body = document.body,
        html = document.documentElement;

      height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
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

  render_main() {
    let class_name = this.constructor.name;
    throw new Error(`Please defined render_main() method on ${class_name}`);
  }

  render_loading() {
    this.view.switchTo('loading');
  }
}

export default AppBase;

import $ from 'jquery';
import _ from 'lodash';

class View {
  constructor(opts) {
    this.pre_render = opts.pre_render;
    this.post_render = opts.post_render;
  }

  render_template(name, data) {
    let template = require(`../../src/templates/${name}.hdbs`);
    return template(data);
  }

  switchTo(name, data) {
    _.isFunction(this.pre_render) && this.pre_render(name, data);

    $('[data-main]').html(this.render_template(name, data));

    _.isFunction(this.post_render) && this.post_render(name, data);
  }
}

export default View;

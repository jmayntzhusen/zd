import Base from './index';

export default class Documentation extends Base {
  constructor(...args) {
    super(...args);
  }

  async search(term) {
    return await this.get(`https://dev-bachelor.s1.umbraco.io/umbraco/api/Documentation/Search?term=${term}`)
  }

  async getDocumentation(url) {
    return await this.get(url);
  }
}

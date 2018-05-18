import Articles from './articles';

class UmracoClient {
  constructor(client) {
    this.client = client;
  }

  get Articles() {
    if(typeof this._Articles === 'undefined') {
      this._Articles = new Articles(this);
    }

    return this._Articles;
  }

  async request(endpoint, httpMethod = 'GET') {
    return await this.client.request({
      url: endpoint,
      type: httpMethod,
      dataType: 'json'
    });
  }

  async get(endpoint) {
    return await this.request(endpoint);
  }

  async put(endpoint) {
    return await this.request(endpoint, 'PUT');
  }

  async post(endpoint) {
    return await this.request(endpoint, 'POST');
  }

  async delete(endpoint) {
    return await this.request(endpoint, 'DELETE');
  }
}

export default class Base {
  constructor(client) {
    this._client = client;
  }

  async request(endpoint, httpMethod) {
    return await this._client.request({
      url: endpoint,
      type: httpMethod,
      dataType: 'json'
    });
  }

  async get(endpoint) {
    return await this.request(endpoint, 'GET');
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

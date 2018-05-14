export default class ApiBase {
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

  put(endpoint) {

  }

  post(endpoint) {

  }

  delete(endpoint) {

  }
}

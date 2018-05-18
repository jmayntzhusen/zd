import Base from './index';

export default class Umbraco extends Base {
  async search(term) {
    const request = await this.get(`https://dev-bachelor.s1.umbraco.io/umbraco/api/Documentation/Search?term=${term}`);

    console.log(request);

    let result = {
      data: [],
      message: request.message,
      response: request.response
    };

    request.data.forEach((item, i) => {
      const segments = item.url.split('/');
      const newItem  = {
        name: item.name,
        url: item.url,
        ourUrl: item.ourUrl,
        category: segments[8]
      };

      result.data.push(newItem);
    });

    return result;
  }
}

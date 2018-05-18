import Base from './base';

class Article extends Base {
  constructor(client, article) {
    super(client);

    Object.entries(article).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}

export default class Articles extends Base {
  constructor(client) {
    super(client);
  }

  async search(term) {
    const request = await this._api.get(`https://dev-bachelor.s1.umbraco.io/umbraco/api/Documentation/Search?term=${term}`);
    let result = {
      data: [],
      message: data.message,
      response: data.response
    };

    request.data.forEach((item, i) => {
      const segments = item.url.split('/');
      const newItem  = {
        name: item.name,
        url: item.url,
        category: segments[8]
      };

      result.data.push(new Article(newItem));
    });

    return result;
  }
}


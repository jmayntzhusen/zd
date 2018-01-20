import StorageBase from './base';


export default class StorageLocal extends StorageBase {
  constructor(namespace) {
    super();

    this.namespace = namespace;
  }

  storage_key(key) {
    return `${this.namespace}:${key}`;
  }

  load(key, fallback) {
    if(localStorage.hasOwnProperty(key)) {
      return JSON.parse(localStorage.getItem(key));
    }

    return fallback;
  }

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

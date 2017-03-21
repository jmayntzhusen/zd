class Storage {
  constructor(namespace) {
    this.namespace = namespace;
  }

  get(key, fallback) {
    let storage_key = `${this.namespace}:${key}`;

    if(localStorage.hasOwnProperty(storage_key)) {
      return JSON.parse(localStorage.getItem(storage_key));
    }
    else {
      return fallback;
    }
  }

  set(keyOrObject, value) {
    if (typeof keyOrObject === 'string') {
      let key = `${this.namespace}:${keyOrObject}`;
      localStorage.setItem(key, JSON.stringify(value));
    } else if (typeof keyOrObject === 'object') {
      Object.keys(keyOrObject).forEach(key => {
        localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(keyOrObject[key]));
      });
    }
  }
}

export default Storage;



export default class StorageBase {
  load(key, fallback) {
    throw new Error(`Please define load() method on ${this.constructor.name} class`);
  }

  save(key, value) {
    throw new Error(`Please define save() method on ${this.constructor.name} class`);
  }

  save_many(object) {
    return Object.entries(object).map(([key, value]) => {
      return this.save(key, value);
    });
  }

  storage_key(key) {
    return key;
  }

  get(key, fallback) {
    return Promise.resolve(this.load(
      this.storage_key(key),
      fallback));
  }

  set(key_or_object, value) {
    if (typeof key_or_object === 'string') {
      return Promise.resolve(this.save(
        this.storage_key(key_or_object),
        value));
    } else if (typeof key_or_object === 'object') {
      return Promise.all(this.save_many(
        Object.assign(...Object.entries(key_or_object).map((k, v) => ({[this.storage_key(k)]: v})))
      ));
    }

    return Promise.reject(key_or_object);
  }
}

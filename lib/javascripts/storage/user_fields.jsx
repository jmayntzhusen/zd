import StorageBase from 'storage/base';


export default class StorageUserField extends StorageBase {
  constructor(client, namespace, field_key) {
    super();

    this.namespace = namespace;
    this.field_key = `currentUser.customField:${field_key}`;
    this.client = client;
  }

  get _user_field_data() {
    return {
      get: () => {
        return this.client.get(this.field_key).then((response) => {
          return JSON.parse(response[this.field_key]);
        });
      },
      set: (value) => {
        return this.client.set(this.field_key, JSON.stringify(value)).then((response) => {
          return value;
        });
      }
    }
  }

  storage_key(key) {
    return `${this.namespace}:${key}`;
  }

  load(key, fallback) {
    return this._user_field_data.get().then((object) => {
      if(object && object.hasOwnProperty(key)) {
        return object[key];
      }

      return fallback;
    });
  }

  save(key, value) {
    this.save_many({[key]: value});
  }

  save_many(object) {
    return this._user_field_data.get().then((field_object) => {
      let _object = Object.assign({}, field_object, object);

      if(JSON.stringify(_object) !== JSON.stringify(field_object)) {
        return this._user_field_data.set(_object);
      }

      return object;
    });
  }
}

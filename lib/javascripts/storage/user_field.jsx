import StorageBase from 'storage/base';


export default class StorageUserField extends StorageBase {
  constructor(app, namespace, field_key) {
    super();

    this.namespace = namespace;
    this.field_key = field_key;
    this.client = app.client;
    this.app = app;
  }

  get _user_field_data() {
    let _path = `/api/v2/users/${this.app.user.id}.json`;

    return {
      get: () => {
        return this.client.request(_path).then((user_data) => {
          return JSON.parse(user_data.user.user_fields[this.field_key]);
        });
      },
      set: (object) => {
        return this._user_field_data.get().then((field_object) => {
          let _object = Object.assign({}, field_object, object);

          if(JSON.stringify(_object) !== JSON.stringify(field_object)) {
            console.log(_path);
            let _data = {
              user: {
                user_fields: {
                  [this.field_key]: JSON.stringify(_object)}}};

            return this.client.request({
              url: _path,
              type: 'PUT',
              data: JSON.stringify(_data),
              contentType: 'application/json'
            }).then((response) => {
              return response.user;
            });
          }

          return object;
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
    return this._user_field_data.set(object);
  }
}

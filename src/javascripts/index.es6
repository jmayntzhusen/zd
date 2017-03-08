/*
 This is the first JavaScript file that runs once your iframe is loaded within a Zendesk product.
 */
import ZAFClient from 'zendesk_app_framework_sdk';
import I18n from 'i18n';

// Create a new ZAFClient
let client = ZAFClient.init();

// add an event listener to detect once your app is registered with the framework
client.on('app.registered', (app_data) => {
  client.get('currentUser').then((user_data) => {
    let user = user_data.currentUser;
    // load translations based on the account's current locale
    I18n.loadTranslations(user.locale);
    // look up app module for the current location
    let location = app_data.context.location;
    let App = require(`./${location}.es6`).default;
    // create a new instance of your app
    new App(client, app_data, user);
  });
});

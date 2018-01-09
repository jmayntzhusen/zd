import I18n from 'i18n';
import ZAFClient from 'zendesk_app_framework_sdk';
import Raven from 'Raven';

if(typeof RAVEN_DSN === 'string') {
  Raven.config(RAVEN_DSN).install();
}

Raven.context(function() {
  let client = ZAFClient.init();

  client.on('app.registered', (app_data) => {
    let location = app_data.context.location;
    let App = require(`./${location}.jsx`).default;

    Raven.setTagsContext({
      version: VERSION,
      location: location,
      subdomain: app_data.context.account.subdomain,
      environment: ENVIRONMENT,
    });

    client.get('currentUser').then((user_data) => {
      let user = user_data.currentUser;

      // Raven context
      Raven.setUserContext({
        email: user.email,
        id: user.id,
      });

      Raven.setTagsContext({
        locale: user.locale,
      });

      I18n.loadTranslations(user.locale);

      new App(client, app_data, user);
    });
  });
});

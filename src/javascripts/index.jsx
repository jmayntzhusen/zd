import I18n from 'utils/i18n';
import ZAFClient from 'zendesk_app_framework_sdk';
import Raven from 'Raven';

require('../images/logo.png');
require('../images/logo-small.png');
require('../images/logo.svg');

// require('../images/screenshot-0.png');
// require('../images/screenshot-1.png');
// require('../images/screenshot-2.png');

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

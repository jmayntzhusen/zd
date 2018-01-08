import manifest from 'app_manifest';
import React from "react";

const defaultLocale = manifest.defaultLocale || 'en';

let translations;

function tryRequire(locale) {
  try {
    return require(`../../src/translations/${locale}.json`);
  } catch(e) {
    return null;
  }
}

const I18n = Object.freeze({
  t: function(key) {
    if (!translations) {
      throw new Error('Translations must be initialized with I18n.loadTranslations before calling `t`.');
    }
    let keyType = typeof key;
    if (keyType !== 'string') {
      throw new Error(`Translation key must be a string, got: ${keyType}`);
    }
    let template = translations[key];
    if (!template) {
      throw new Error(`Missing translation: ${key}`);
    }
    return template;
  },
  loadTranslations: function(locale) {
    translations = tryRequire(locale) ||
      tryRequire(locale.replace(/-.+$/,'')) || // e.g. fallback `en-US` to `en`
      tryRequire(defaultLocale) ||
      {};
  }
});


class T extends React.Component {
  constructor(...args) {
    super(...args);

    this.default = this.props.children;
    this.var = this.props.var || this.default;
  }

  render() {
    try {
      return I18n.t(this.var);
    } catch(e) {
      console.warn(e);
      return this.var;
    }
  }
}

export { I18n as default, T };

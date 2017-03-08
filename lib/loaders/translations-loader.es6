"use strict";

let loaderUtils = require('loader-utils');
let handlebars = require('handlebars');
let path = require('path');
let hb = handlebars.create();
const JS_INDENT = 2;

function flatten(object) {
  let flattened = {};
  Object.keys(object).forEach(function(key) {
    if (object[key] && typeof object[key] === 'object') {
      let flatObject = flatten(object[key]);
      Object.keys(flatObject).forEach(function(key2) {
        flattened[[key, key2].join('.')] = flatObject[key2];
      });
    } else {
      flattened[key] = object[key];
    }
  });
  return flattened;
}

function compileTranslations(translations) {
  let flattenedTranslations = flatten(translations);
  let rows = Object.keys(flattenedTranslations).map(function(translationKey) {
    let template = hb.precompile(flattenedTranslations[translationKey]);
    return `${JSON.stringify(translationKey)}: (Handlebars["default"] || Handlebars).template(${template})`;
  });
  return `{ ${rows.join(',\n')} }`;
}

function extractMarketplaceTranslation(translations, jsonPath) {
  let permittedKeys = ["name", "description", "instructions", "parameters"];
  let translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM ${jsonPath} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  };
  permittedKeys.forEach(function(key) {
    if (key in translations.app) {
      translationsOutput.app[key] = translations.app[key];
    }
  });
  return JSON.stringify(translationsOutput, null, JS_INDENT);
}

// This loader performs two tasks:
// 1. It extracts the app name, description, instructions and parameters keys
//    and saves them to the dist/translations/[locale].json files
// 2. It compiles the Handlebars templates for the translation file to be used
//    within the app's i18n shim
function TranslationsLoader(content) {
  this.cacheable && this.cacheable();
  let query = loaderUtils.parseQuery(this.params);
  let name = this.params && this.params.name || '../translations/[name].json';
  let runtimePath = this.params && this.params.runtime || require.resolve("handlebars/runtime");

  let translationsInput = JSON.parse(content);
  let translationsPath = path.relative(this.options.context, this.resourcePath);
  let marketplaceTranslations = extractMarketplaceTranslation(translationsInput, translationsPath);
  let url = loaderUtils.interpolateName(this, name, { content: marketplaceTranslations });
  this.emitFile(url, marketplaceTranslations);

  let compiledTranslations = compileTranslations(translationsInput);
  return `
    let Handlebars = require(${JSON.stringify(runtimePath)});
    module.exports = ${compiledTranslations};
  `;
}

module.exports = TranslationsLoader;
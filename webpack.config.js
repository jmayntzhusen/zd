const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/********* Utils *****************************/

require.extensions['.md'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

/********* End of utils **********************/

const PRODUCTION = (process.env.NODE_ENV === 'production');

const ENVIRONMENT = PRODUCTION ? 'production' : 'development';

const RAVEN_DSN = undefined;  // Set this in production

const extractSCSS = new ExtractTextPlugin('[name].css');

/********* Prepare Zendesk app files *********/
let manifest = JSON.stringify(require(path.resolve(__dirname, './src/manifest.json')));
let pkg = require(path.resolve(__dirname, './package.json'));

let _version = typeof pkg.version !== 'undefined' ?
  pkg.version.replace(/^(\d+)((?:\.\d+)+?)(?:\.0)*$/, '$1$2') :
  '1.0';

if(!PRODUCTION) {
  _version += '.dev'
}

manifest = manifest
  .replace('{{version}}', _version)
  .replace('{{author}}', pkg.author);

let _short_description = require('./src/marketplace/en/short_description.md');
let _long_description = require('./src/marketplace/en/long_description.md');
let _installation_instructions = require('./src/marketplace/en/installation_instructions.md');

let _lang_en = JSON.stringify(require('./src/translations/en.json'))
  .replace('{{name}}', JSON.parse(manifest).name)
  .replace('{{long_description}}', _long_description.replace(/\n/gm, '\\n'))
  .replace('{{short_description}}', _short_description.replace(/\n/gm, '\\n'))
  .replace('{{installation_instructions}}', _installation_instructions.replace(/\n/gm, '\\n'));
/********* End of preparation ****************/

let externalAssets = {
  css: [
    /**
     * Zendesk Garden CSS components
     *
     * See http://garden.zendesk.com/css-components/
     */
    'https://assets.zendesk.com/apps/sdk-assets/css/2/zendesk_garden.css'
  ],
  js: [
    //'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
    //'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js',
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js',
    'https://cdnjs.cloudflare.com/ajax/libs/raven.js/3.18.1/raven.min.js',
    PRODUCTION ?
      'https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/react.production.min.js' :
      'https://cdnjs.cloudflare.com/ajax/libs/react/16.0.0/umd/react.development.js',
    PRODUCTION ?
      'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/react-dom.production.min.js' :
      'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.0.0/umd/react-dom.development.js'
  ]
};

let config = {
  entry: {
    //'babel-polyfill': ['babel-polyfill'],
    index: [
      './src/javascripts/index.jsx',
      './src/stylesheets/index.scss'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: {
    rules: [
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader',
              options: {
                sourceMap: !PRODUCTION
              }},
            { loader: 'sass-loader',
              options: {
                sourceMap: !PRODUCTION
              }
            }
          ]
        })
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              plugins: ['transform-class-properties']
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'lib/javascripts'),
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
      'handlebars': 'handlebars/runtime.js',
      'app_manifest': path.resolve(__dirname, 'src/manifest.json')
    },
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx']
  },
  externals: {
    //jquery: 'jQuery',
    Raven: 'Raven',
    zendesk_app_framework_sdk: 'ZAFClient'
  },
  plugins: [
    extractSCSS,
    new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./lib/templates/layout.ejs - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: './lib/templates/layout.ejs',
      filename: 'index.html'
    }),
    new GenerateJsonPlugin('../translations/en.json', {'app': JSON.parse(_lang_en).app}),
    new GenerateJsonPlugin('../manifest.json', JSON.parse(manifest)),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(ENVIRONMENT),
      VERSION: JSON.stringify(_version),
      RAVEN_DSN: JSON.stringify(RAVEN_DSN),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ]
};

if(PRODUCTION) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  );

  config.plugins.push(
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        ecma: 8,
        compress: true,
        comments: false
      }
    })
  );
}
else {
  config.devtool = "source-map";
}

module.exports = config;

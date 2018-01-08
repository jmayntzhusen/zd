const path = require('path');
const webpack = require('webpack');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var manifest = JSON.stringify(require(path.resolve(__dirname, './src/manifest.json')));
var pkg = require(path.resolve(__dirname, './package.json'));

const PRODUCTION = (process.env.NODE_ENV === 'production');

const ENVIRONMENT = PRODUCTION ? 'production' : 'development';

const RAVEN_DSN = undefined;  // Set this in production

const extractSCSS = new ExtractTextPlugin('[name].css');

/********* Prepare Zendesk app files *********/
var _version = typeof pkg.version !== 'undefined' ?
  pkg.version.replace(/^(\d+)((?:\.\d+)+?)(?:\.0)*$/, '$1$2') :
  '1.0';

if(!PRODUCTION) {
  _version += '.dev'
}

manifest = manifest
  .replace('{{version}}', _version);
/********* End of preparation ****************/

var externalAssets = {
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

var config = {
  entry: {
    index: [
      './src/javascripts/index.jsx',
      './lib/stylesheets/base.scss',
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
        test: /\.(png|gif|jpe?g)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 10000
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
      path.resolve(__dirname, 'lib/loaders'),
      path.resolve(__dirname, 'node_modules')
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
    new CopyWebpackPlugin([
      { from: 'src/images/logo.png', to: 'logo.png' },
      { from: 'src/images/logo-small.png', to: 'logo-small.png' },
      { from: 'src/images/logo.svg', to: 'logo.svg' },
      //{ from: 'src/images/screenshot-1.png', to: 'screenshot-1.png' },
      //{ from: 'src/images/screenshot-2.png', to: 'screenshot-2.png' },
      //{ from: 'src/images/screenshot-3.png', to: 'screenshot-3.png' },
      { from: 'src/translations/en.json', to: '../translations/en.json' }
    ]),
    new GenerateJsonPlugin('../manifest.json', JSON.parse(manifest)),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(ENVIRONMENT),
      VERSION: JSON.stringify(_version),
      RAVEN_DSN: JSON.stringify(RAVEN_DSN),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
        ecma: 6,
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

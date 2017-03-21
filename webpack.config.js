const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = (process.env.NODE_ENV == 'production');

const extractSCSS = new ExtractTextPlugin('[name].css');

var externalAssets = {
  css: [
    'https://assets.zendesk.com/apps/sdk-assets/css/0/zendesk_garden.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/g/lodash@4.17.4,handlebarsjs@4.0.5,jquery@3.1.1',
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js'
  ]
};

const plugins = [
  extractSCSS,
  new HtmlWebpackPlugin({
    warning: 'AUTOMATICALLY GENERATED FROM ./lib/templates/layout.hdbs - DO NOT MODIFY THIS FILE DIRECTLY',
    vendorCss: externalAssets.css,
    vendorJs: externalAssets.js,
    template: './lib/templates/layout.hdbs',
    filename: 'index.html'
  })
];

if(PRODUCTION) {
  // plugins.push(new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: true
  //   }
  // }));
}

module.exports = {
  entry: {
    index: [
      './src/javascripts/index.es6',
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
        test: /\.(png|gif|jpe?g)/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 10000
          }
        }
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, './src/translations'),
        use: {
          loader: 'translations-loader',
          options: {
            runtime: 'handlebars'
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.(js|es6)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      {
        test: /\.hdbs/,
        use: {
          loader: "handlebars-loader",
          options: {
            extensions: ['hdbs'],
            runtime: "handlebars",
            inlineRequires: '\/images\/'
          }
        }
      },
      {
        test: /fonts\/.+\.(svg|woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].font.[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'lib/javascripts'),
      'node_modules'
    ],
    alias: {
      'handlebars': 'handlebars/runtime.js',
      'app_manifest': path.resolve(__dirname, 'dist/manifest.json')
    },
    extensions: ['.js', '.es6', '.json']
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'lib/loaders'),
      'node_modules'
    ],
    extensions: ['.js', '.es6', '.json']
  },
  externals: {
    handlebars: 'Handlebars',
    jquery: 'jQuery',
    lodash: '_',
    zendesk_app_framework_sdk: 'ZAFClient'
  },
  devtool: "source-map",
  plugins: plugins
};

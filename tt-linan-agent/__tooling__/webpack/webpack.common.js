/* globals __dirname */

const path = require('path')
const webpack = require('webpack')
const postcssPresetEnv = require('postcss-preset-env')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const rootDir = path.resolve(__dirname, "..", "..")
const manifest = require(path.resolve(rootDir, 'manifest.json'))

module.exports = {
  entry: path.resolve(rootDir, "src/index.js"),
    
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@root': path.resolve(rootDir, "src/"),
      '@utils': path.resolve(rootDir, "src/utils/"),
      '@services': path.resolve(rootDir, "src/services/"),
      '@components': path.resolve(rootDir, "src/components/")
    }
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "Dashboard/plugin": "DashboardPlugin",
    "Dashboard/modules": "DashboardModules"
  },

  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: true
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.(js|jsx|css)$/,
        loader: 'string-replace-loader',
        exclude: /node_modules/,
        options: {
          multiple: [
            {
              search: '@plugin_bundle_class',
              replace: manifest.bundle.replace(/\./g, '-'),
              flags: 'g'
            },
            {
              search: '@plugin_bundle_version',
              replace: manifest.version.replace(/\./g, '-'),
              flags: 'g'
            },
            {
              search: '@plugin_bundle',
              replace: manifest.bundle,
              flags: 'g'
            }
          ]
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(rootDir, 'babel.config.js')
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
              importLoaders: 1,
              sourceMap: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                postcssPresetEnv()
              ]
            }
          }
        ]
      }
    ]
  },

  stats: {
    colors: true,
    errors: true,
    warnings: true,
    errorDetails: true,

    hash: false,
    assets: false,
    chunks: false,
    source: false,
    version: false,
    timings: false,
    modules: false,
    reasons: false,
    children: false,
    publicPath: false
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'SC_ATTR': JSON.stringify(`data-${manifest.bundle.replace(/\./g, '-')}`)
      }
    })
  ]
}
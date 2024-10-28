/* globals __dirname process */

process.env.NODE_ENV = "production"

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')
const merge = require('webpack-merge')


module.exports = merge(common,
  {
    mode: 'production',
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "..", "..", "dist"),
      publicPath: "/"
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        })
      ]
    },
    plugins: []
  }
)
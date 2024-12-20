/* globals process, __dirname */

/*
|--------------------------------------------------------------------------
| Server.js
|--------------------------------------------------------------------------
|
| This is your local server. Kickstart it by running npm server and it will serve your plugin so that you can install it
| on dev.dashboard.infomaker.io.
|
*/

'use strict'

const express = require('express')
const app = express()
const cors = require('cors')
const manifest = require('./manifest.json')
const ip = require('ip')

process.env.PORT = process.env.PORT || 7000

const PORT = process.env.PORT

const useHOT = process.env.HOT === "1"
const useSSL = process.env.SSL === "1"

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token")
  res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, POST, PUT, OPTIONS, TRACE")

  if (req.url.match(/(manifest.json)$/)) {
    res.header("Content-Type", "application/json; charset=utf-8")
  }

  next()
})

app.use(cors())


if (useHOT) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require("webpack-dev-middleware")
  const webpackHotMiddleware = require("webpack-hot-middleware")
  const webpackConfig = require("./__tooling__/webpack/webpack.dev.hot.config.js")

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    historyApiFallback: true,
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler, {
    path: "/__webpack_hmr",
  }))
} else {
  app.use(express.static(__dirname + '/build'))
}

if (useSSL) {
  const fs = require('fs')
  const https = require('https')

  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app).listen(PORT, () => {
    console.log(`\n🎉  ${manifest.name} manifest.json served at https://${ip.address()}:${PORT}/manifest.json`)
  })
} else {
  const http = require('http').Server(app)

  http.listen(PORT, () => {
    console.log(`\n🎉  ${manifest.name} manifest.json served at http://${ip.address()}:${PORT}/manifest.json`)
  })
}
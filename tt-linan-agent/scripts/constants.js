/* eslint-env node */

const path = require('path')

const ROOT_PATH = path.resolve(__dirname, '..')

const MANIFEST_NAME = 'manifest.json'
const MANIFEST_PATH = path.resolve(__dirname, '..', MANIFEST_NAME)

const MANIFEST_TEMPLATE_NAME = 'manifest_template.json'
const MANIFEST_TEMPLATE_PATH = path.resolve(__dirname, '..', MANIFEST_TEMPLATE_NAME)

const ICON_NAME = 'icon.png'
const ICON_PATH = path.resolve(__dirname, '..', ICON_NAME)

const MARKDOWN_NAME = 'markdown.md'
const MARKDOWN_PATH = path.resolve(__dirname, '..', MARKDOWN_NAME)

const THUMBNAIL_NAME = 'thumbnail.png'
const THUMBNAIL_PATH = path.resolve(__dirname, '..', THUMBNAIL_NAME)

const DIST_NAME = 'dist'
const DIST_PATH = path.resolve(__dirname, '..', DIST_NAME)

const INDEX_NAME = 'index.js'
const INDEX_PATH = path.resolve(DIST_PATH, INDEX_NAME)

const STYLE_NAME = 'style.css'
const STYLE_PATH = path.resolve(DIST_PATH, STYLE_NAME)

module.exports = {
  ROOT_PATH,
  MANIFEST_NAME,
  MANIFEST_PATH,
  MANIFEST_TEMPLATE_NAME,
  MANIFEST_TEMPLATE_PATH,
  ICON_NAME,
  ICON_PATH,
  MARKDOWN_NAME,
  MARKDOWN_PATH,
  THUMBNAIL_NAME,
  THUMBNAIL_PATH,
  DIST_NAME,
  DIST_PATH,
  INDEX_NAME,
  INDEX_PATH,
  STYLE_NAME,
  STYLE_PATH
}
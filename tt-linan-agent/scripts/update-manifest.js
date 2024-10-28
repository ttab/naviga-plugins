'use strict'

const fs = require('fs')
const pjson = require('../package.json')
const constants = require('./constants')

/**
 * Entry  point for script. Updates version in manifest.json.
 */
const update = () => {
  try {
    // Get manifest
    const data = fs.readFileSync(constants.MANIFEST_PATH, 'utf8')
    const manifest = JSON.parse(data)

    // Update version using package.json ditto
    manifest.version = pjson.version

    // Write manifest
    fs.writeFileSync(constants.MANIFEST_PATH, JSON.stringify(manifest, null, 4))

    // Splendid
    console.info(`Manifest (manifest.json) updated to version ${pjson.version}`)
    process.exit(0)
  } catch (e) {
    console.error('Failed to update manifest', e)
    process.exit(1)
  }
}

update()

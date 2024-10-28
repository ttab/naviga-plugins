/*eslint-env node */
'use strict'

const fs = require('fs')
const constants = require('./constants')

const _validateManifestJson = (manifest) => {
  if (!manifest.bundle) {
    throw new Error('Invalid manifest. Missing bundle')
  }

  if (!manifest.name) {
    throw new Error('Invalid manifest. Missing name')
  }

  if (!manifest.description) {
    throw new Error('Invalid manifest. Missing description')
  }

  if (!manifest.author) {
    throw new Error('Invalid manifest. Missing author')
  }

  if (!manifest.version) {
    throw new Error('Invalid manifest. Missing version')
  }
}

const _validateNotEmpty = (file, data) => {
  if (data.length === 0) {
    throw new Error(`Mandatory file ${file} is empty`)
  }
}

const _fileExists = (file) => {
  if (!fs.existsSync(file)) {
    throw new Error(`Mandatory file ${file} does not exist`)
  }
}

/**
 * Entry point for script. Validate that mandatory files exist (and are valid).
 */
const validate = () => {
  try {
    // Validate manifest.json
    _fileExists(constants.MANIFEST_PATH)
    const manifestData = fs.readFileSync(constants.MANIFEST_PATH, 'utf8')
    _validateNotEmpty(constants.MANIFEST_PATH, manifestData)

    const manifest = JSON.parse(manifestData)
    _validateManifestJson(manifest)

    // Happy days! Everything validates
    console.info('Plugin is valid!')
    process.exit(0)
  } catch (e) {
    console.error('Failed to validate plugin', e)
    process.exit(1)
  }
}

validate()

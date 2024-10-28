'use strict'

const fs = require('fs')

let manifest

beforeAll(() => {
  manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'))
})

describe('Validate manifest.json', () => {
  it('Should contain bundle', () => {
    expect(manifest.bundle).toBeTruthy()
  })

  it('Should contain name', () => {
    expect(manifest.name).toBeTruthy()
  })

  it('Should contain description', () => {
    expect(manifest.description).toBeTruthy()
  })

  it('Should contain version', () => {
    expect(manifest.version).toBeTruthy()
  })

  it('Should contain author', () => {
    expect(manifest.author).toBeTruthy()
  })
})

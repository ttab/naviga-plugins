'use strict'

const fs = require('fs')

describe('Verify readme', () => {
  it('markdown.md should exists', () => {
    const exists = fs.statSync('markdown.md')
    expect(exists).toBeTruthy()
  })
})

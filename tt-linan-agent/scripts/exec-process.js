/*eslint-env node */
'use strict'

const exec = require('child_process').exec

const result = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, function(err, stdout, stderr) {
      if (err) {
        return reject(err)
      } else if (typeof (stderr) !== "string") {
        return reject(stderr)
      } else {
        return resolve(stdout)
      }
    })
  })
}

exports.result = result
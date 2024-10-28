/* eslint-env node */

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const aws = require('aws-sdk')
const colors = require('colors/safe')
const constants = require('./constants')

let args = {}

process.argv.forEach(arg => {
  const parts = arg.split('=')

  if (parts[0] && parts[1] && parts.indexOf(parts[0]) > -1) {
    args[parts[0]] = parts[1]
  }
})

const s3BucketName = args.S3_BUCKET_NAME
const s3BucketRegion = args.S3_REGION
const s3AccessKey = args.S3_ACCESS_KEY
const s3SecretAccessKey = args.S3_SECRET_ACCESS_KEY

const s3Bucket = new aws.S3({
  region: s3BucketRegion,
  accessKeyId: s3AccessKey,
  secretAccessKey: s3SecretAccessKey
})

let manifest = require(path.resolve(constants.MANIFEST_PATH))

const bundlePath = manifest.bundle.replace(/\./g, '-').toLowerCase()
const versionPath = manifest.version.replace(/\./g, '-').toLowerCase()
const baseKey = `${bundlePath}/${versionPath}`

console.log('\n')
console.log(`\t ${colors.bgWhite(colors.black(' -------------------- '))}`)
console.log(`\t ${colors.bgWhite(colors.black('  Plugin S3 uploader  '))}`)
console.log(`\t ${colors.bgWhite(colors.black(' -------------------- '))}`)
console.log('\n')

const uploadIndexJS = () => {
  return new Promise((resolve, reject) => {
    zlib.gzip(fs.readFileSync(path.resolve(constants.INDEX_PATH)), (error, result) => {
      if (error) {
        reject(error)
      } else {
        putItem({
          data: result,
          reject: reject,
          resolve: resolve,
          contentEncoding: 'gzip',
          key: constants.INDEX_NAME,
          contentType: 'text/javascript',
        })
      }
    })
  })
}

const uploadStyleCSS = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(constants.STYLE_PATH), (error, styleFile) => {
      // If no error acrosed and there was a styleFile then we try to upload it.
      // else we skip uploading styleFile
      if (!error && styleFile) {
        zlib.gzip(fs.readFileSync(path.resolve(constants.STYLE_PATH)), (err, results) => {
          if (!err) {
            putItem({
              data: results,
              reject: reject,
              resolve: resolve,
              contentType: 'text/css',
              contentEncoding: 'gzip',
              key: constants.STYLE_NAME
            })
          } else {
            reject(err)
          }
        })
      } else {
        console.log(` - No ${constants.STYLE_NAME} file was found!`)
        resolve(null)
      }
    })
  })
}

const uploadImage = (fileName, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), (error, imageFile) => {
      if (!error && imageFile) {
        // If no error acrosed and there was an imageFile then we try to upload it.
        // else we skip uploading imageFile
        putItem({
          key: fileName,
          reject: reject,
          data: imageFile,
          resolve: resolve,
          contentType: 'image/png'
        })
      } else {
        console.log(` - No ${fileName} file was found!`)
        resolve(null)
      }
    })
  })
}

const uploadIconPNG = () => {
  return new Promise((resolve, reject) => {
    if (manifest.graphic_url) {
      console.log('Found a graphic_url in manifest file, ignore uploading icon!')
      resolve(null)
    } else {
      uploadImage(constants.ICON_NAME, constants.ICON_PATH)
        .then(resolve)
        .catch(reject)
    }
  })
}

const uploadThumbnailPNG = () => {
  return new Promise((resolve, reject) => {
    if (manifest.thumbnail_url) {
      console.log('Found a thumbnail_url in manifest file, ignore uploading thumbnail!')
      resolve(null)
    } else {
      uploadImage(constants.THUMBNAIL_NAME, constants.THUMBNAIL_PATH)
        .then(resolve)
        .catch(reject)
    }
  })
}

const uploadMarkdownMD = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(constants.MARKDOWN_PATH), (error, markdownFile) => {
      if (!error) {
        if (markdownFile) {
          putItem({
            reject: reject,
            resolve: resolve,
            data: markdownFile,
            contentType: 'text/markdown',
            key: constants.MARKDOWN_NAME
          })
        } else {
          resolve(null)
        }
      } else {
        reject(error)
      }
    })
  })
}

const uploadManifestJSON = ({
  iconLocation,
  markdownLocation,
  thumbnailLocation
}) => {
  return new Promise((resolve, reject) => {
    const updatedManifest = manifest

    if (iconLocation) {
      updatedManifest.graphic_url = iconLocation
    }

    if (markdownLocation) {
      updatedManifest.markdown_url = markdownLocation
    }

    if (thumbnailLocation) {
      updatedManifest.thumbnail_url = thumbnailLocation
    }

    updatedManifest.buildVersion = Date.now()

    putItem({
      reject: reject,
      resolve: resolve,
      key: constants.MANIFEST_NAME,
      contentType: 'application/json',
      data: JSON.stringify(updatedManifest, null, 4)
    })
  })
}

const putItem = params => {
  s3Bucket.upload(
    {
      Bucket: s3BucketName,
      Key: baseKey + '/' + params.key,
      Body: params.data,
      ContentType: params.contentType,
      ContentEncoding: params.contentEncoding || 'UTF-8',
      ACL: 'public-read'
    },
    (err, data) => {
      if (err) {
        return params.reject(err)
      } else {
        return params.resolve(data.Location)
      }
    }
  )
}

const handleUpload = async() => {
  try {
    console.log(`\n - uploading ${constants.INDEX_NAME} >>>`)
    const indexLocation = await uploadIndexJS()

    console.log(`\n - uploading ${constants.STYLE_NAME} >>>`)
    const styleLocation = await uploadStyleCSS()

    console.log(`\n - uploading ${constants.ICON_NAME} >>>`)
    const iconLocation = await uploadIconPNG()

    console.log(`\n - uploading ${constants.MARKDOWN_NAME} >>>`)
    const markdownLocation = await uploadMarkdownMD()

    console.log(`\n - uploading ${constants.THUMBNAIL_NAME} >>>`)
    const thumbnailLocation = await uploadThumbnailPNG()

    console.log(`\n - uploading ${constants.MANIFEST_NAME} >>>`)
    const manifestLocation = await uploadManifestJSON({
      iconLocation,
      markdownLocation,
      thumbnailLocation
    })

    iconLocation && console.log(`\n > uploaded plugin ${constants.ICON_NAME} > ${iconLocation}`)
    markdownLocation && console.log(`\n > uploaded plugin ${constants.MARKDOWN_NAME} > ${markdownLocation}`)
    thumbnailLocation && console.log(`\n > uploaded plugin ${constants.THUMBNAIL_NAME} > ${thumbnailLocation}`)
    indexLocation && console.log(`\n > uploaded plugin ${constants.INDEX_NAME} > ${indexLocation}`)
    styleLocation && console.log(`\n > uploaded plugin ${constants.STYLE_NAME} > ${styleLocation}`)
    manifestLocation && console.log(`\n > uploaded plugin ${constants.MANIFEST_NAME} > ${manifestLocation}`)

    process.exit(0)
  } catch(error) {
    console.log(error)
    process.exit(1)
  }
}

handleUpload()
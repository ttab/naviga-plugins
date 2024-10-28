import {Utility} from '@root'
import {CATEGORIES} from '@root/constants'
const {format} = Utility.DateFNS
import {isSameDay} from 'date-fns' // not available in Dashboard v4.0.0...

export const formatThousands = thousands => {
  return Math.abs(thousands).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
}

// Returns string in the format '19:43' or, if item.datetime isn't current date, '2/5 19:43'
export const formatTime = timestamp => {
  const d1 = new Date()
  const d2 = new Date(timestamp)
  const date = isSameDay(d1, d2) ? '' : format(d2, 'd/M ')
  const time = format(d2, 'H:mm')
  return `${date}${time}`
}

export const getImages = article => {
  const associations = article.associations || {}
  const images = Object.values(associations)
    .filter(a => a.type === 'picture' && a.renditions)
    .map(a => a.renditions.r03.href)
  return images.length ? images : null
}

// Returns metadata string, i.e. 'Inrikes · regeringssammanträdeUV2 · 974 tkn'
export const getMetadata = article => {
  let category = ''
  const products = article.product.map(p => p.code)
  for (const c of CATEGORIES) {
    const categoryFound = products.some(p => c.products.includes(p))
    if (categoryFound) {
      category = c.label
      break
    }
  }
  return `${category ? `${category} · ` : ''}${article.slugline} · ${formatThousands(article.charcount)} tkn`
}

// Returns sector for articles that hasn't got any
export const getSector = article => {
  const products = article.product.map(p => p.code)
  for (const c of CATEGORIES) {
    const categoryFound = products.some(p => c.products.includes(p))
    if (categoryFound) {
      return c.sector
    }
  }
  return ''
}
import { Plugin } from '@root'
import { v5 as uuidv5, v1 as uuidv1 } from 'uuid'
import {
  ALL_PRODUCTS,
  MAX_TT_HITS,
  MAX_OC_HITS,
  UUID_NAMESPACE,
  HOST,
  SEARCH_ENDPOINT,
  STREAM_ENDPOINT,
  AGREEMENT_ENDPOINT
} from '@root/constants'

class Agent extends Plugin.Agent {
  constructor(props) {
    super(props)

    this.token = window.localStorage.getItem(`${this.props.bundle}:token`)

    this.on('tt-linan:get_feed', ({UUID}) => {
      this.getFeed(UUID)
    })

    this.on('tt-linan:load_more', ({UUID, fromIndex, filters, keyword}) => {
      this.loadMore(UUID, fromIndex, filters, keyword)
    })

    this.on('tt-linan:import_text', ({UUID, item, copy, user}) => {
      this.postToImporter(UUID, item, copy, user)
    })

    this.on('tt-linan:token_retrieved', ({token}) => {
      this.token = token
      window.localStorage.setItem(`${this.props.bundle}:token`, token)
      this.send('tt-linan:token_refreshed')
    })

    const triggerConfig = this.props.config.triggerConfig ? JSON.parse(this.props.config.triggerConfig) : {}
    this.triggers = triggerConfig.triggers || []

    this.polling = false
    this.publishedArticles = {}
    this.agreements = ''
    this.getOpenContentArticles()
  }

  async getOpenContentArticles() {
    const {openContentUrl, openContentUser, openContentPassword} = this.props.config
    const openContentCredentials = btoa(`${openContentUser}:${openContentPassword}`)
    const openContentPort = openContentUrl.includes('https') ? '8443' : '8080'
    const endpoint = `${openContentUrl}:${openContentPort}/opencontent/search`
    const queryParts = [
      'start=0',
      `limit=${MAX_OC_HITS}`,
      'properties=uuid,source',
      'contenttype=Article',
      'deleted=false',
      'q=source:TT*',
      'sort.indexfield=updated',
      'sort.updated.ascending=false'
    ]
    const url = `${endpoint}?${queryParts.join('&')}`
    const options = {
      url,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${openContentCredentials}`
      },
      credentials: 'include'
    }
    try {
      const response = await Plugin.request(options)
      if (!response.ok) {
        throw new Error(`Fel vid hämtning av publicerade artiklar: Servern svarade med statuskod ${response.status}.`)
      }
      const result = await response.json()
      const {hits} = result.hits
      this.publishedArticles = hits.reduce((map, hit) => {
        const uuid = hit.versions[0].properties.uuid[0]
        const slug = hit.versions[0].properties.source[0].substring(3) // Slugline always follows after 'TT/'
        map[uuid] = slug
        return map
      }, {})
    } catch (err) {
      console.error(err) // Not so serious, no need to notify user
    } finally {
      this.send('tt-linan:oc_articles_fetched')
    }
  }

  handleResponse(response) {
    if (response.status === 200) {
      return response.json()
    }
    else if (response.status === 401) {
      this.send('tt-linan:token_expired')
    }
    return Promise.reject(new Error(`Servern svarade med statuskod ${response.status}.`))
  }

  handleError(error, targetUUID, errorType = 'error') {
    console.error(error)
    if (targetUUID) {
      this.send({
        name: `tt-linan:${errorType}`,
        targetUUID,
        userData: {
          error
        }
      })
    }
    else {
      this.send('tt-linan:error', {error})
    }
  }

  handleTimeout(message, targetUUID, textId) {
    console.log(message)
    this.send({
      name: 'tt-linan:timeout',
      targetUUID,
      userData: {
        message,
        textId
      }
    })
  }

  getFeed(targetUUID) {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    }
    let url = `${HOST}${AGREEMENT_ENDPOINT}`
    let agreements
    fetch(url, options)
      .then(response => this.handleResponse(response))
      .then(response => {
        agreements = this.agreements = response.filter(agr => agr.type === 'Subscription').map(agr => agr.id).join(',')
        url = `${HOST}${SEARCH_ENDPOINT}?p=${ALL_PRODUCTS.join(',')}&agr=${agreements}&s=${MAX_TT_HITS}`
        return fetch(url, options)
      })
      .then(response => this.handleResponse(response))
      .then(response => {
        const feed = this.enrichItems(response.hits)
        this.send({
          name: 'tt-linan:feed_fetched',
          targetUUID,
          userData: {
            feed
          }
        })
        const lastItem = feed.length ? feed[0].uri : ''
        if (!this.polling) {
          this.pollForUpdates(agreements, lastItem)
        }
      })
      .catch(error => {
        this.handleError(error, targetUUID)
      })
  }

  loadMore(targetUUID, fromIndex) {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    }
    const queryParts = [
      `p=${ALL_PRODUCTS.join(',')}`,
      `agr=${this.agreements}`,
      `s=${MAX_TT_HITS}`,
      `fr=${fromIndex}`
    ]
    let url = `${HOST}${SEARCH_ENDPOINT}?${queryParts.join('&')}`
    fetch(url, options)
      .then(response => this.handleResponse(response))
      .then(response => {
        const texts = this.enrichItems(response.hits)
        this.send({
          name: 'tt-linan:more_texts_loaded',
          targetUUID,
          userData: {
            texts
          }
        })
      })
      .catch(error => {
        this.handleError(error, targetUUID)
      })
  }

  pollForUpdates(agreements, lastItem) {
    this.polling = true
    const url = `${HOST}${STREAM_ENDPOINT}?p=${ALL_PRODUCTS.join(',')}&agr=${agreements}&last=${lastItem}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then(response => this.handleResponse(response))
      .then(response => {
        const newItems = this.enrichItems(response.hits)
        this.notifyIfUrgent(newItems)
        if (newItems.length && newItems[0].uri !== lastItem) { // In case of API hickup, prevent showing same text twice
          this.send('tt-linan:update', {newItems})
          lastItem = newItems[0].uri
        }
        setTimeout(() => this.pollForUpdates(agreements, lastItem), 3000) // Arbitrarily chosen delay
      })
      .catch(error => {
        this.polling = false
        this.handleError(error)
      })
  }

  // Enriches article objects with attributes textId, containsTrigger and earlierVersionPublished
  enrichItems(hits) {
    return hits.map((item => {
      const baseSlug = item.revisions[0].slug
      const textId = uuidv5(item.job + baseSlug, UUID_NAMESPACE)
      const containsTrigger = this.triggers.some(trigger => {
        const word = trigger.toLowerCase()
        const regex = new RegExp(`${word.startsWith('*') ? '' : '(\\b|\\s)'}${word.replace(/\*/g, '')}${word.endsWith('*') ? '' : '(\\b|\\s|[^a-zåäö]])'}`, 'i')
        return regex.test(item.slug) || regex.test(item.body_text)
      })
      const earlierVersionPublished = this.publishedArticles[textId] && this.publishedArticles[textId] != item.slug && item.replacing ? true : false
      return Object.assign({}, item, {textId, containsTrigger, earlierVersionPublished})
    }))
  }

  notifyIfUrgent(items) {
    items.forEach(item => {
      if (item.urgency === 1) {
        Plugin.notifications.add({
          uuid: Plugin.createUUID(),
          message: item.body_text,
          level: 'warning',
          autoDismiss: 0
        })
      }
    })
  }

  async postToImporter(targetUUID, item, copy, user) {
    const {importerUrl} = this.props.config
    const {name, sub, organisation, unit} = user
    let queryParts = [
      `subname=${name}`,
      `sub=${sub}`,
      `organization=${organisation}`,
      `unit=${unit}`
    ]
    if (copy) {
      item.textId = uuidv1()
      queryParts.push(`uuid=${item.textId}`)
    }
    const url = `${importerUrl}?${queryParts.join('&')}`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }
    const start = new Date()
    try {
      const response = await fetch(url, options)
      let uuid
      if (response.ok) {
        const result = await response.json()
        uuid = result.uuid
      } else if (response.status === 504) {
        // Timeout -- use 'manually' created uuid
        console.log('Timeout vid import av text...')
        uuid = item.textId
      } else {
        throw new Error(`Fel vid anrop till importtjänst: Servern svarade med statuskod ${response.status}.`)
      }
      this.send({
        name: 'tt-linan:text_imported',
        targetUUID,
        userData: {
          textId: uuid
        }
      })
      this.publishedArticles[uuid] = item.slug
    } catch (err) {
      const end = new Date()
      // Hack to distinguish timeout from other errors...
      if (end-start >= 25000) {
        this.handleTimeout('Timeout vid anrop till importtjänst.', targetUUID, item.textId)
      } else {
        this.handleError(err, targetUUID, 'import_error')
      }
    }
  }
}

export {
  Agent
}
import {Plugin} from '@root'
const {getAction, withUser} = Plugin
import MultiSelect from '@components/MultiSelect'
import FilterInput from '@components/FilterInput'
import FeedSettings from '@components/FeedSettings'
import Articles from '@components/Articles'
import ArticlePreview from '@components/ArticlePreview'
import Alert from '@components/Alert'
import {getSector} from '@utils/utils'
import {DROPDOWN_OPTIONS, AUTH_ENDPOINT} from '@root/constants'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
`

const AGENT_BUNDLE = 'se.tt.tt-linan-agent'

class ApplicationClass extends Plugin.Application {
  constructor(props) {
    super(props)
    const filters = JSON.parse(window.localStorage.getItem(`${this.props.id}:filters`))
    const keyword = window.localStorage.getItem(`${this.props.id}:keyword`)
    const storedImageSetting = window.localStorage.getItem(`${this.props.id}:showImages`)
    this.state = {
      feed: [],
      filters: filters || [],
      keyword: keyword || '',
      loggedIn: true,
      error: null,
      loading: false,
      showImages: storedImageSetting ? JSON.parse(storedImageSetting) : true
    }

    // handle keyword filters (if present)
    const triggerConfig = this.props.config.triggerConfig ? JSON.parse(this.props.config.triggerConfig) : {}
    const {label, highlightColor, filterProperty} = triggerConfig
    this.triggerFilter = label && filterProperty ? [{label, filterProperty}] : []
    this.highlightColor = highlightColor

    // outside of state b/c should not affect rendering of app
    this.filteredFeed = null
    this.selectedIndex = 0

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.setKeyword = this.setKeyword.bind(this)
    this.loadMoreTexts = this.loadMoreTexts.bind(this)
    this.saveImageSetting = this.saveImageSetting.bind(this)
    this.openPreview = this.openPreview.bind(this)
    this.handleImport = this.handleImport.bind(this)
    this.openInWriterAction = getAction('OPEN_IN_WRITER')
    this.openInWriter = this.openInWriter.bind(this)
    this.notifyUser = this.notifyUser.bind(this)
  }

  componentDidMount() {
    this.ready(AGENT_BUNDLE, () => {
      const hash = window.location.hash
      if (hash.includes('access_token')) {
        // user has just logged in
        const token = hash.match(/access_token=(.*)&/)[1]
        window.location.hash = ''
        this.send('tt-linan:token_retrieved', {token})
        this.setState({loggedIn: true})
      } else {
        // try to fetch feed with existing token
        this.send('tt-linan:get_feed')
        this.setState({loading: true})
      }
    })

    this.on('tt-linan:oc_articles_fetched', () => {
      this.send('tt-linan:get_feed')
      this.setState({loading: true})
    })

    this.on('tt-linan:feed_fetched', ({feed}) => {
      this.setState({feed, loading: false})
    })

    this.on('tt-linan:update', ({newItems}) => {
      const oldFeed = this.state.feed
      this.setState({
        feed: newItems.concat(oldFeed)
      })
    })

    this.on('tt-linan:more_texts_loaded', ({texts}) => {
      const oldFeed = this.state.feed
      this.setState({
        feed: oldFeed.concat(texts),
        loading: false
      })
    })

    this.on('tt-linan:text_imported', ({textId}) => {
      this.openInWriter(textId)
      Plugin.modal.close()
      const {notifyAfterImport} = this.props.config
      if (notifyAfterImport) {
        const message = `Texten har importerats till OC och har id ${textId}. Klicka 'Öppna' nedan för att öppna den på nytt.`
        this.notifyUser(message, 'success', () => {
          this.openInWriter(textId)
        })
      }
      const feed = this.state.feed.slice()
      // feed can contain several versions with same id
      feed.forEach((article, index) => {
        if (article.textId === textId) {
          feed[index].earlierVersionPublished = false
        }
      })
      this.setState({feed})
    })

    this.on('tt-linan:import_error', ({error}) => {
      Plugin.modal.close()
      const message = `Texten kunde inte importeras: ${error.message}. Prova igen om en stund.`
      this.notifyUser(message, 'error')
    })

    this.on('tt-linan:timeout', ({message, textId}) => {
      const fullMessage = `${message} Prova att klicka 'Öppna' nedan om en stund. Om inte det funkar, testa att importera på nytt.`
      Plugin.modal.close()
      this.notifyUser(fullMessage, 'warning', () => {
        this.openInWriter(textId)
      })
    })

    this.on('tt-linan:token_expired', () => {
      this.setState({
        loggedIn: false
      })
    })

    this.on('tt-linan:token_refreshed', () => {
      this.send('tt-linan:get_feed')
    })

    this.on('tt-linan:error', ({error}) => {
      this.setState({error, loading: false})
    })

    window.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
    this.off()
  }

  openInWriter(uuid) {
    const {writerUrl} = this.props.config
    const url = `${writerUrl}${writerUrl[writerUrl.length - 1] === '/' ? '' : '/'}#${uuid}`
    this.openInWriterAction({
      uuid,
      url
    })
  }

  notifyUser(message, level, onConfirm) {
    const confirm = onConfirm ? ({
      buttonTexts: ['Avbryt', 'Öppna'],
      onConfirm
    }) : null
    try {
      Plugin.notifications.add({
        uuid: Plugin.createUUID(),
        message,
        level,
        confirm,
        autoDismiss: 0
      })
    } catch (error) {
      console.error(error)
    }
  }

  handleKeyPress(e) {
    if ((e.key === 'ArrowUp' && this.selectedIndex > 0) || (e.key === 'ArrowDown' && this.selectedIndex < this.filteredFeed.length - 1)) {
      this.selectedIndex = e.key === 'ArrowUp' ? this.selectedIndex - 1 : this.selectedIndex + 1
      const article = this.filteredFeed[this.selectedIndex]
      this.send('tt-linan:update_preview', {article})
    }
  }

  addFilter(option) {
    const filters = this.state.filters.slice()
    filters.push(option)
    this.saveFilters(filters)
  }

  removeFilter(option) {
    const filters = this.state.filters.filter(f => {
      return f.label !== option.label
    })
    this.saveFilters(filters)
  }

  saveFilters(filters) {
    this.setState({filters})
    window.localStorage.setItem(`${this.props.id}:filters`, JSON.stringify(filters))
  }

  setKeyword(keyword) {
    this.setState({keyword})
    window.localStorage.setItem(`${this.props.id}:keyword`, keyword)
  }

  loadMoreTexts() {
    const {feed, filters, keyword} = this.state
    this.send('tt-linan:load_more', {
      fromIndex: feed.length,
      filters,
      keyword
    })
    this.setState({loading: true})
  }

  saveImageSetting(showImages) {
    this.setState({showImages})
    window.localStorage.setItem(`${this.props.id}:showImages`, JSON.stringify(showImages))
  }

  openPreview(props, index) {
    this.selectedIndex = index
    Plugin.modal.open({
      component: ArticlePreview,
      props: {
        config: this.props.config,
        connectedApp: this.props.UUID,
        handleImport: this.handleImport,
        ...props
      }
    })
  }

  handleImport(article, copy = false) {
    this.send({
      name: 'tt-linan:import_text',
      userData: {
        item: article.sector ? article : {sector: getSector(article), ...article},
        copy,
        user: this.props.user
      }
    })
  }

  render() {
    const {clientId} = this.props.config
    const redirectUri = window.location.href
    const {feed, filters, keyword, loggedIn, error, loading, showImages} = this.state

    // figure out which articles to show...
    let articles = feed.filter(article => {
      const passes = (f) => {
        let values
        if (f.filterProperty.name === 'earlierVersionPublished') {
          return article.earlierVersionPublished
        }
        else if (f.filterProperty.name === 'containsTrigger') {
          return article.containsTrigger
        }
        else if (f.filterProperty.valueKey) {
          values = article[f.filterProperty.name].map(el => el[f.filterProperty.valueKey])
        }
        else {
          values = article[f.filterProperty.name]
        }
        return values.some(v => f.filterProperty.values.includes(v))
      }
      return filters.some(passes)
    })
    if (keyword !== '') {
      articles = articles.filter(article => {
        const word = keyword.toLowerCase()
        return article.slugline.toLowerCase().includes(word) || article.body_text.toLowerCase().includes(word)
      })
    }
    const filteredFeed = this.filteredFeed = articles

    const LoginAlert = () => {
      const handleClick = () => {
        const url = `${AUTH_ENDPOINT}?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=roles`
        window.location.replace(url)
      }
      const headline = 'Du är inte inloggad'
      const content = <p>Klicka här för att komma till TT:s inloggningssida.</p>
      return (
        <Alert
          level='warning'
          headline={headline}
          content={content}
          handleClick={handleClick}
        />
      )
    }

    const ErrorAlert = () => {
      const handleClick = () => {
        this.setState({error: null})
        this.send('tt-linan:get_feed')
      }
      let level = '', headline, content
      if (error.name === 'TypeError') {
        // computer has probably been in sleep mode
        headline = 'Du verkar ha varit borta'
        content = <p>Klicka här för att uppdatera nyhetsfeeden.</p>
      } else {
        level = 'error'
        headline = 'Något gick snett vid hämtningen av nyheter...'
        content = <p>{error.message} Klicka här för att försöka igen.</p>
      }
      return (
        <Alert
          level={level}
          headline={headline}
          content={content}
          handleClick={handleClick}
        />
      )
    }

    return (
      <Wrapper>
        <MultiSelect
          options={DROPDOWN_OPTIONS.concat(this.triggerFilter)}
          selected={filters}
          placeholder='Välj textkategorier'
          handleSelect={this.addFilter}
          handleDeselect={this.removeFilter}
          valueProp='label'
        />
        <Row>
          <FilterInput
            value={keyword}
            handleChange={this.setKeyword}
          />
          <FeedSettings
            showImages={showImages}
            handleShowImagesChange={() => this.saveImageSetting(!showImages)}
          />
        </Row>
        {error && loggedIn && <ErrorAlert />}
        {loggedIn ? (
          <Articles
            articles={filteredFeed}
            showImages={showImages}
            highlightColor={this.highlightColor}
            searching={loading}
            showLoadMore={!loading && filters.length ? true : false}
            handleLoadMoreClick={this.loadMoreTexts}
            showPreview={this.openPreview}
          />) : <LoginAlert />
        }
      </Wrapper>
    )
  }
}

const Application = withUser(ApplicationClass)

export {
  Application
}

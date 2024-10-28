import {Plugin, GUI} from '@root'
const {Button} = GUI
import {useState, useEffect} from 'react'
import styled from 'styled-components'
import {formatTime, getMetadata} from '@utils/utils'
import Spinner from '@components/Spinner'

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  .byline {
    margin: 10px 0 10px 0;
    font-style: italic;
  }
`

const TextWrapper = styled.div`
  flex: 2;
  margin-right: 40px;
  line-height: 1.5em;
  h1, h2, h4 {
    font-weight: bold;
  }
  h1 {
    font-size: 32px;
    margin-bottom: 12px;
    line-height: normal;
  }
  .dat {
    color: #8c8c8c;
    .source {
      &:before {
        content: ' (';
      }
      &:after {
        content: ')';
      }
    }
  }
  p, blockquote {
    margin-bottom: 10px;
  }
  blockquote:before {
    content: '– '
  }
  h2 {
    font-size: 1.2em;
    margin: 10px 0px 5px 0px;
  }
  aside {
    margin-top: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
  }
`

const ButtonWrapper = styled.div`
  margin-bottom: 20px;
  button {
    margin-right: 10px;
  }
`

const InfoWrapper = styled.div`
  padding: 20px 10px;
  margin-bottom: 20px;
  background-color: #f0f0f0;
`

const MetadataWrapper = styled.div`
  font-size: 0.9em;
  margin-bottom: 10px;
`

const ImageWrapper = styled.div`
  flex: 1;
  figure {
    margin-bottom: 20px;
    img {
      width: 100%;
    }
  }
`

const ArticlePreview = props => {
  const [article, setArticle] = useState(props.article)
  const [importing, setImporting] = useState(false)
  const {
    connectedApp,
    config,
    handleImport
  } = props
  const {
    openInWriterButton,
    openCopyInWriterButton,
    openOnTTWebButton
  } = config

  const modalAPI = Plugin.useModal()
  const events = Plugin.event(Plugin.createUUID())

  useEffect(() => {
    modalAPI.setTitle('Förhandsvisning')
    modalAPI.setSize(Plugin.MODALSIZE.NORMAL)

    events.on('tt-linan:update_preview', ({UUID, article}) => {
      if (UUID === connectedApp) {
        setArticle(article)
      }
    })

    return () => {
      events.off()
    }
  }, [])

  const {description_usage, body_html5} = article

  // extract html for the different parts
  const articleHtml = body_html5.match(/<article>.*<\/article>/)[0]
  const textHtml = articleHtml.replace(/<figure>.*<\/figure>/, '')
  const figureTagMatches = articleHtml.match(/<figure>.*<\/figure>/)
  const imageHtml = figureTagMatches ? figureTagMatches[0] : null

  return (
    <Wrapper>
      <TextWrapper>
        <ButtonWrapper>
          {openInWriterButton && <Button onClick={() => {setImporting(true); handleImport(article)}}>Öppna i Writer</Button>}
          {openCopyInWriterButton && <Button onClick={() => {setImporting(true); handleImport(article, true)}}>Öppna kopia i Writer</Button>}
          {openOnTTWebButton && <Button onClick={() => window.open(article.uri)}>Öppna på TT:s kundwebb</Button>}
        </ButtonWrapper>
        {importing && <Spinner text='Importerar text...' />}
        {description_usage && <InfoWrapper>{description_usage}</InfoWrapper>}
        <MetadataWrapper>{`${formatTime(article.datetime)} · ${getMetadata(article)}`}</MetadataWrapper>
        <div dangerouslySetInnerHTML={{__html: textHtml}}></div>
      </TextWrapper>
      <ImageWrapper>
        <div dangerouslySetInnerHTML={{__html: imageHtml}}></div>
      </ImageWrapper>
    </Wrapper>
  )
}

export default ArticlePreview
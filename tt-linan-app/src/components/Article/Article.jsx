import {GUI} from '@root'
const {Card, Icon} = GUI
import styled from 'styled-components'
import {formatTime, getMetadata, getImages} from '@utils/utils'

const Wrapper = styled.div`
  padding-right: 10px;
  cursor: pointer;
  img {
    height: 60px;
  }
`

const CardHeaderWrapper = styled.div`
  margin-bottom: 5px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
`

const CardHeaderLeft = styled.div`
  display: flex;
  font-weight: 700;
`

const CardHeaderRight = styled.div`
  display: flex;
  cursor: pointer;
  padding: 4px 0 4px 4px;
`

const CardHeaderLogo = styled.div`
  img {
    height: 18px;
  }
  margin-right: 4px;
`

const CardHeaderMetaBox = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 18px;
  height: 18px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1px 4px;
  border-radius: 2px;
  margin: 0px 3px 0px 0px;
`

const CardFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.marginTop};
  font-size: 11px;
  font-weight: 400;
  font-family: Lato;
  color: rgba(51, 51, 51);
`

const CardFooterLeft = styled.div`
  display: flex;
  align-items: flex-end;
  line-height: 1.5em;
`

const Article = props => {
  const {
    article,
    index,
    showPreview,
    highlightColor,
    showImages
  } = props

  const timestamp = formatTime(article.datetime)
  const metadata = getMetadata(article)
  const images = showImages ? getImages(article) : null

  const header = <CardHeaderWrapper>
    <CardHeaderLeft>
      <CardHeaderLogo>
        <img src='https://ttnewsagency-logo.s3-eu-west-1.amazonaws.com/svart.png' />
      </CardHeaderLogo>
      {article.webprio && <CardHeaderMetaBox>{article.webprio}</CardHeaderMetaBox>}
      {article.earlierVersionPublished &&
        <CardHeaderMetaBox title='Uppdatering av tidigare publicerad artikel'>!</CardHeaderMetaBox>
      }
    </CardHeaderLeft>
    <CardHeaderRight>
      <Icon color='' height={11} width={11} weight='regular' name='time-clock-circle' />
      <span style={{margin: '0px 5px'}}>{timestamp}</span>
    </CardHeaderRight>
  </CardHeaderWrapper>

  const footer = <CardFooterWrapper marginTop={showImages && images ? '0' : '5px'}>
    <CardFooterLeft>{metadata}</CardFooterLeft>
  </CardFooterWrapper>

  return (
    <Wrapper>
      <Card
        headerContent={header}
        footerContent={footer}
        headline={article.headline}
        displayStatusBar={true}
        styleObject={{
          textColor: '#000',
          backgroundColor: highlightColor && article.containsTrigger ? highlightColor : '#999',
          borderColor: article.urgency === 1 ? '#ed3b3f' : '#1473e6'
        }}
        images={images}
        onClick={() => showPreview({article}, index)}
      />
    </Wrapper>
  )
}

export default Article

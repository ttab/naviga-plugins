import {Plugin, GUI} from '@root'
const {Scrollable} = Plugin.ViewUtil
const {Icon} = GUI
import styled from 'styled-components'
import Article from '@components/Article'
import Spinner from '@components/Spinner'

const Wrapper = styled.div`
  flex: 1;
  padding: 5px 0px 0px 5px;
  background-color: #f5f5f5;
`

const LoadMore = styled.div`
  padding: 10px;
  text-align: center;
  color: #fff;
  background-color: #828282;
  cursor: pointer;
  margin: 3px 10px 10px 0px;
  border-radius: 5px;
  > * {
    vertical-align: middle;
    margin-left: 5px;
  }
`

const Articles = props => {
  const {
    articles,
    showLoadMore,
    handleLoadMoreClick,
    searching,
    showPreview,
    highlightColor,
    showImages
  } = props
  return (
    <Wrapper>
      <Scrollable>
        {articles.map((article, index) => {
          return (
            <Article
              article={article}
              index={index}
              showPreview={showPreview}
              highlightColor={highlightColor}
              showImages={showImages}
            />
          )
        })}
        {showLoadMore &&
          <LoadMore onClick={handleLoadMoreClick}>
            Ladda fler artiklar
            <Icon
              color=''
              height={16}
              width={16}
              weight='regular'
              name='chevron-down'
            />
          </LoadMore>
        }
        {searching && <Spinner />}
      </Scrollable>
    </Wrapper>
  )
}

export default Articles

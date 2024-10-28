import {GUI} from '@root'
const {Hint} = GUI
import styled from 'styled-components'

const Wrapper = styled.div`
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  margin-bottom: 5px;
`

const Alert = props => {
  const {
    level = '',
    headline,
    content,
    handleClick
  } = props

  return (
    <Wrapper clickable={handleClick ? true : false} onClick={handleClick}>
      <Hint variant={level} headline={headline}>
        {content}
      </Hint>
    </Wrapper>
  )
}

export default Alert
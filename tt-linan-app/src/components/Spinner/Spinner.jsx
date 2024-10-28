import {GUI} from '@root'
const {Icon} = GUI
import styled, {keyframes} from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  padding: 10px 0 20px 0;
  text-align: ${props => props.hasText ? 'start' : 'center'};
  > * {
    animation: ${rotate} 1s linear infinite;
    vertical-align: middle;
  }
  span {
    margin-right: 10px;
    font-style: italic;
  }
`

const Spinner = ({text}) => {
  return (
    <Wrapper hasText={text ? true : false}>
      {text && <span>{text}</span>}
      <Icon
        color=''
        height={16}
        width={16}
        weight='regular'
        name='spinner'
      />
    </Wrapper>
  )
}

export default Spinner
import {GUI} from '@root'
const {Icon} = GUI
import styled from 'styled-components'

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  margin-bottom: 5px;
  height: 40px;
`

const IconWrapper = styled.div`
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  flex-shrink: 0;
  padding: 4px 4px 2px 4px;
`

const InputWrapper = styled.div`
  flex: 1;
  margin: 0 10px 0 10px;
  input {
    padding: 0;
    border: none;
    font-size: 100%;
    font-family: 'Lato', Helvetica Neue;
    width: 100%;
    background-color: inherit;
  }
  input:focus {
    outline: none;
  }
`

const FilterInput = ({value, handleChange}) => {
  return (
    <Wrapper>
      <IconWrapper>
        <Icon height={16} width={16} name='filter' />
      </IconWrapper>
      <InputWrapper>
        <input
          type='text'
          value={value}
          placeholder='Filtrera...'
          onChange={(e) => handleChange(e.target.value)}
        />
      </InputWrapper>
      {value &&
        <IconWrapper clickable onClick={() => handleChange('')}>
          <Icon height={16} width={16} name='remove' />
        </IconWrapper>
      }
    </Wrapper>
  )
}

export default FilterInput
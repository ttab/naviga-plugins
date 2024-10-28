import {Plugin, GUI} from '@root'
const {EnhanceWithClickOutside} = Plugin.ViewUtil
const {Icon, Checkbox} = GUI
import {useState} from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 5px;
`

const Anchor = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const AnchorLabel = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 5px;
`

const AnchorIconWrapper = styled.div`
  flex-shrink: 0;
`

const OptionList = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 41px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1;
`

const Option = styled.div`
  padding: 10px 20px 10px 10px;
  cursor: pointer;
`

const MultiSelect = props => {
  const {
    placeholder,
    options,
    selected,
    handleSelect,
    handleDeselect,
    valueProp
  } = props

  const [open, setOpen] = useState(false)
  const handleAnchorClick = () => setOpen(!open)
  const anchorLabel = selected.length ? selected.map(s => s.label).join(', ') : placeholder

  return (
    <Wrapper>
      <EnhanceWithClickOutside handleClickOutside={() => setOpen(false)}>
        <Anchor onClick={handleAnchorClick} >
          <AnchorLabel>{anchorLabel}</AnchorLabel>
          <AnchorIconWrapper>
            <Icon
              color=''
              height={16}
              width={16}
              weight='regular'
              name={open ? 'chevron-up' : 'chevron-down'}
            />
          </AnchorIconWrapper>
        </Anchor>
        {open && 
          <OptionList>
            {options.map(o => {
              const isSelected = selected.some(s => s[valueProp] === o[valueProp])
              return <Option>
                <Checkbox
                  label={o.label}
                  checked={isSelected}
                  onChange={() => isSelected ? handleDeselect(o) : handleSelect(o)}
                />
              </Option>
            })}
          </OptionList>
        }
      </EnhanceWithClickOutside>
    </Wrapper>
  )
}

export default MultiSelect
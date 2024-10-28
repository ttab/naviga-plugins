import {Plugin, GUI} from '@root'
const {EnhanceWithClickOutside} = Plugin.ViewUtil
const {Icon, Checkbox} = GUI
import {useState} from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 5px 5px 0;
`

const Anchor = styled.div`
  margin: 5px;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  > * {
    flex-shrink: 0;
  }
`

const OptionList = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 41px;
  right: 0px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1;
`

const Option = styled.div`
  padding: 10px 20px 10px 10px;
  cursor: pointer;
  white-space: nowrap;
`

const FeedSettings = props => {
  const {
    showImages,
    handleShowImagesChange
  } = props
  const [open, setOpen] = useState(false)

  return (
    <Wrapper>
      <EnhanceWithClickOutside handleClickOutside={() => setOpen(false)}>
        <Anchor onClick={() => setOpen(!open)}>
          <Icon height={16} width={16} name='navigation-menu-vertical' />
        </Anchor>
        {open && 
          <OptionList>
            <Option>
              <Checkbox
                label='Visa bilder'
                checked={showImages}
                onChange={() => {handleShowImagesChange(); setOpen(false)}}
              />
            </Option>
          </OptionList>
        }
      </EnhanceWithClickOutside>
    </Wrapper>
  )
}

export default FeedSettings
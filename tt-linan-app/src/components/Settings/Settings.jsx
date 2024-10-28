import { Plugin } from '@root'
const GUI = Plugin.GUI
import styled from 'styled-components'

const Wrapper = styled.div``

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  input {
    margin-bottom: 5px;
  }
`

class Settings extends Plugin.Settings {
  plugin() {
    return (
      <Wrapper>
        <GUI.ConfigPassword name='Appens id' ref={refs => this.handleRefs(refs, 'clientId')} validation={['required']} />
        <GUI.ConfigInput name='Adress till Writer' ref={refs => this.handleRefs(refs, 'writerUrl')} validation={['required']} />
        <CheckboxWrapper>
          <GUI.Label text='Knappar' />
          <GUI.ConfigCheckbox ref={refs => this.handleRefs(refs, 'openInWriterButton')} label='Öppna i Writer' />
          <GUI.ConfigCheckbox ref={refs => this.handleRefs(refs, 'openCopyInWriterButton')} label='Öppna kopia i Writer' />
          <GUI.ConfigCheckbox ref={refs => this.handleRefs(refs, 'openOnTTWebButton')} label='Öppna på TT:s kundwebb' />
        </CheckboxWrapper>
        <GUI.ConfigSwitchButton label='Visa bekräftelse efter import' ref={ref => this.handleRefs(ref, 'notifyAfterImport')} />
        <GUI.ConfigEditor name='Inställningar för nyckelordsfilter' ref={refs => this.handleRefs(refs, 'triggerConfig')} />
      </Wrapper>
    )
  }
}

export {
  Settings
}
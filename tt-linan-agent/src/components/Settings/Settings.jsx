import { Plugin } from '@root'

const GUI = Plugin.GUI

class Settings extends Plugin.Settings {
  plugin() {
    return (
      <div className='@plugin_bundle_class-settings'>
        <GUI.ConfigInput name='Adress till importtjänst' ref={refs => this.handleRefs(refs, 'importerUrl')} validation={['required']} />
        <GUI.ConfigInput name='Adress till OC' ref={refs => this.handleRefs(refs, 'openContentUrl')} />
        <GUI.ConfigPassword name='OC-användare' ref={refs => this.handleRefs(refs, 'openContentUser')} />
        <GUI.ConfigPassword name='OC-lösenord' ref={refs => this.handleRefs(refs, 'openContentPassword')} />
        <GUI.ConfigEditor name='Inställningar för nyckelordsfilter' ref={refs => this.handleRefs(refs, 'triggerConfig')} />
      </div>
    )
  }
}

export {
  Settings
}
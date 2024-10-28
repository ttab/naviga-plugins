import DashboardPlugin from 'Dashboard/plugin'
import { GUI, Utility } from 'Dashboard/modules'

const Plugin = new DashboardPlugin('@plugin_bundle')

const registerPlugin = () => {
  const { Application } = require('@components/Application')
  const { Settings } = require('@components/Settings')
  Plugin.register({
    application: Application,
    settings: Settings,
    requirements: {
      actions: [
        {
          id: 'OPEN_IN_WRITER',
          name: 'Öppna i Writer',
          description: 'Action som öppnar artikel i Navigas Writer-plugin om den finns i samma arbetsyta, annars i en ny browserflik'
        }
      ]
    }
  })
}

registerPlugin()

if (module.hot && typeof module.hot.accept === 'function') {
  module.hot.accept()
}

export {
  GUI,
  Plugin,
  Utility
}
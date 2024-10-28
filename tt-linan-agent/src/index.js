import DashboardPlugin from 'Dashboard/plugin'
import { GUI, Utility } from 'Dashboard/modules'

import '@root/style.css'

const Plugin = new DashboardPlugin('@plugin_bundle')

const registerPlugin = () => {
  const { Agent } = require('@components/Agent')
  const { Settings } = require('@components/Settings')
  Plugin.register({
    agent: Agent,
    settings: Settings
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
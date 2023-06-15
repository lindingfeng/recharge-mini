import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { updateManager } from '@global/common/taro'

import './app.scss'

const App = createApp({
  onLaunch (options) {
    // 检查更新
    updateManager()
  }
})

App.use(createPinia())

export default App

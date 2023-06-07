import Taro from '@tarojs/taro'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { updateManager } from '@global/common/taro'

import './app.scss'

const App = createApp({
  onLaunch (options) {
    // 检查更新
    updateManager()
    Taro.setStorageSync('recharge_ui', {
      token: '46fd1173011b455fe389eb5743193cd7',
      needAuth: '0'
    })
  }
})

App.use(createPinia())

export default App

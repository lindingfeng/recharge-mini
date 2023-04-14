import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { updateManager } from '@global/common/taro'
// import { Icon, Popup, OverLay } from '@nutui/nutui-taro'

import './app.scss'

const App = createApp({
  onLaunch (options) {
    console.log('onLaunch', options)
    // 检查更新
    updateManager()
  }
})

App
.use(createPinia())
// .use(Icon)
// .use(Popup)
// .use(OverLay)

export default App

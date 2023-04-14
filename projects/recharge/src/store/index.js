import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'
import { TaroAsync } from '@global/common/taro'

export const useStore = defineStore('main', {
  state: () => ({}),
  actions: {
    /**
     * @function 获取广告位
     * @param {Object} data 跳转参数
     * @param {string} data.jumpType 跳转类型 1 小程序 2 H5 3 APP 4 其他（小程序页面）
     * 1：wx50974afb2488d5ef@pages/index/index 注意：页面路径如果带参数，需要encodeURIComponent
     * 2、https://xxx
     * 4、/pages/index/index
     */
    bannerJump (data = {}) {
      if (!data.link) return
      let jumpUrl = data.link
      switch (data.jumpType) {
        case '1': {
          const [appId, path = '', extraData = '{}', envVersion = 'release'] = jumpUrl.split('@')
          if (!appId) return
          TaroAsync(Taro.navigateToMiniProgram, {
            appId,
            path: decodeURIComponent(path),
            extraData: JSON.parse(extraData),
            envVersion
          })
          break
        }
        case '2': {
          Taro.navigateTo({
            url: `/pages/webview/index?webUrl=${encodeURIComponent(jumpUrl)}`
          })
          break
        }
        case '4': {
          Taro.navigateTo({
            url: jumpUrl
          })
          break
        }
      }
    }
  }
})
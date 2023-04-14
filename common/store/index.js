import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global-main', {
  state: () => ({
    env: process.env.TARO_ENV || '',
    systemInfo: Taro.getSystemInfoSync() || {},
    locationInfo: {},
    inviteInfo: {},
    rectInfo: {},
    config: {},
  }),
  actions: {
    /**
     * @function 更新配置项
     * @param {Object} configs 配置项
     */
    setConfig (configs = {}) {
      Object.assign(this.config, configs)
    },
    /**
     * @function 更新位置信息
     * @param {Object} configs 位置信息
     */
    setLocation (location = {}) {
      Object.assign(this.locationInfo, location)
    },
    /**
     * @function 获取菜单按钮（右上角胶囊按钮）的布局位置信息
     */
    getNavMenuButtonInfo () {
      let rect
      const systemInfo = this.systemInfo
      try {
        rect = Taro.getMenuButtonBoundingClientRect()
        // 取值为异常的情况
        if (!rect || !rect.width || !rect.top || rect.top < systemInfo.statusBarHeight) {
          throw new Error('getMenuButtonBoundingClientRect error')
        }
      } catch (error) {
        // 胶囊按钮上下间距 使导航内容居中
        let gap = ''
        // 胶囊的宽度，android大部分96，ios为88
        let width = 96
        if (systemInfo.platform === 'android') {
          gap = 8
          width = 96
        } else if (systemInfo.platform === 'devtools') {
          if (systemInfo.model.indexOf('iPhone') !== -1) {
            // 开发工具中ios手机
            gap = 5.5
          } else {
            // 开发工具中android和其他手机
            gap = 7.5
          }
        } else {
          gap = 4
          width = 88
        }
        if (!systemInfo.statusBarHeight) {
          // 开启wifi的情况下修复statusBarHeight值获取不到
          systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
        }
        rect = {
          // 获取不到胶囊信息就自定义重置一个
          width: width,
          height: 32,
          left: systemInfo.windowWidth - width - 10,
          right: systemInfo.windowWidth - 10,
          top: systemInfo.statusBarHeight + gap,
          bottom: systemInfo.statusBarHeight + gap + 32,
        }
      }
      rect.navigatorBarHeight = rect.height + rect.top + 5
      this.rectInfo = rect || {}
    },
  }
})
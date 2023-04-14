import Taro from '@tarojs/taro'
import { useGlobalStore } from '@global/common/store'

/**
 * @function 异步请求
 * 之所以配置入参配置success/fail
 * 是因为部分接口返回非Promise
 * 所以做下兼容处理，即：非Promise，则在success/fail里resolve
 */
export const TaroAsync = (interfaceFunc, body = {}) => {
  return new Promise((resolve) => {
    if (typeof interfaceFunc !== 'function') {
      return resolve([{}, { message: '接口函数必传' }])
    }

    const interfaceCallback = interfaceFunc({
      ...body,
      success: function (res) {
        if (!interfaceCallback) {
          resolve([res, null])
        }
      },
      fail: function (err) {
        if (!interfaceCallback) {
          resolve([{}, err])
        }
      }
    })
    if (interfaceCallback) {
      interfaceCallback.then(res => resolve([res, null])).catch(err => resolve([{}, err]))
    }
  })
}

/**
 * @function 小程序版本更新
 */
export const updateManager = () => {
  const globalStore = useGlobalStore()

  if (!['weapp', 'alipay'].includes(globalStore.env)) return

  try {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate()
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  } catch (e) {
    console.log('版本不支持自动更新')
  }
}
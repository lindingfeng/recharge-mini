import Taro from '@tarojs/taro'
import { TaroAsync } from '@global/common/taro'
import { useGlobalStore } from '@global/common/store'
import { useGlobalUserStore } from '@global/common/store/user'
import { getUserInfo } from '@global/helper/loginManage'
import { createApiSign, randomWord } from '@global/utils'
import { envMap } from '@global/config'

/**
 * @function http基类
 * @param {Object} config Request配置项
 * @param {Object} hooks 各节点hooks
 * @param {String} appSecret 接口验签key
 * @param {Function} userRequest 自定义请求
 * @param {Function} userResponse 自定义响应
 */
export default class BaseService {
  constructor ({ config = {}, hooks = {}, appId = '', appSecret, userRequest, userResponse }) {
    this.userRequest = userRequest || this.defaultRequest.bind(this)
    this.userResponse = userResponse || this.defaultResponse.bind(this)
    this.config = config
    this.hooks = hooks
    this.appId = appId
    this.appSecret = appSecret
    this.service = null
    this.logining = false
    this.loginTime = 0
    this.requestQueue = []
    this.initBase()
  }
  /**
   * 创建http实例
   */
  initBase () {
    this.service = (path, body = {}, requestConfig = {}) => {
      return new Promise((resolve) => {
        const globalStore = useGlobalStore()
        const globalUserStore = useGlobalUserStore()
        const data = this.userRequest(body)

        TaroAsync(Taro.request, {
          url: this.config.baseUrl + path,
          data,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Token': globalUserStore.userInfo?.token || getUserInfo('token'),
            'Access-Client': envMap[globalStore.env].CLIENT || ''
          },
          ...this.config,
          ...requestConfig
        }).then(([response, error]) => {
          if (error || response.statusCode !== 200) {
            const data = this.defaultResponseError(error || response)
            if (Array.isArray(data)) {
              resolve(data)
            }
          } else {
            resolve(this.userResponse(response))
          }
        })
      })
    }
  }
  /**
   * 配置hooks
   */
  setHooks (hooks = {}) {
    Object.assign(this.hooks, hooks)
  }
  /**
   * 签名数据
   */
  _getSignData () {
    return {
      app_id: this.appId,
      timestamp: parseInt(new Date() / 1000, 10),
      nonce_str: randomWord(false, 6)
    }
  }
  /**
   * 默认Request处理
   */
  defaultRequest (data = {}) {
    const signData = this._getSignData()

    if (this.appSecret) {
      data.sign = createApiSign(this.appSecret, Object.assign({}, signData))
    }

    Object.assign(data, signData)

    this.hooks.onBeforeRequest && this.hooks.onBeforeRequest(data)
    
    return data
  }
  /**
   * 默认Response处理
   */
  defaultResponse (response, isParse = false) {
    return [isParse ? JSON.parse(response.data) : response.data, null]
  }
  /**
   * 默认Response Error处理
   */
  defaultResponseError (error) {
    this.hooks.onResponseError && this.hooks.onResponseError(error)
    let returnData = true
    const status = error.status || error.statusCode
    Taro.hideLoading()
    switch (status) {
      case 400:
        Taro.showToast({
          icon: 'none',
          title: '缺失参数'
        })
        break;
      case 401: {
        // 未登录/登录失效
        const globalStore = useGlobalStore()
        const globalUserStore = useGlobalUserStore()
        const timestamp = +new Date()
        returnData = false
        // console.log('logining', this.logining)
        // console.log('timestamp', timestamp)
        // console.log('loginTime', this.loginTime)
        if (
          this.logining ||
          (this.loginTime === 0 && timestamp < this.loginTime) ||
          (this.loginTime > 0 && timestamp > this.loginTime)
        ) return

        this.logining = true
        globalUserStore.logout()

        if (this.hooks.onAfterLoginFailure) {
          this.logining = false
          return this.hooks.onAfterLoginFailure(globalStore, globalUserStore)
        }

        globalUserStore.login(globalStore.inviteInfo).then(([loginRes]) => {
          this.logining = false
          this.loginTime = +new Date()
          if (loginRes.status === 200) {
            // 重载当前页面的onLoad、onShow方法
            const pageInstance = Taro.getCurrentInstance()
            pageInstance.page.onLoad(pageInstance.page.options || {})
            pageInstance.page.onShow()
          } else {
            Taro.showToast({
              icon: 'none',
              title: loginRes.message || '登录失败'
            })
          }
        })
        break;
      }
      case 403:
        Taro.showToast({
          icon: 'none',
          title: '签名认证失败'
        })
        break;
      case 500:
        Taro.showToast({
          icon: 'none',
          title: '服务端错误'
        })
        break;
      default: {
        Taro.showToast({
          icon: 'none',
          title: `请求错误（错误码：${error.status || error.error || '-1'}）`
        })
        break;
      }
    }
    if (returnData) {
      return [{}, error]
    }
  }
}
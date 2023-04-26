import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'
import { TaroAsync } from '@global/common/taro'
import { getUserInfo, setUserInfo, clearUserInfo } from '@global/helper/loginManage'
import apis from '@global/apis'

export const useGlobalUserStore = defineStore('global-user', {
  state: () => ({
    isNeedLogin: false,
    apiStatus: {
      loginCode: false
    },
    loginCode: {
      code: '',
      timestamp: 0
    },
    userInfo: getUserInfo()
  }),
  actions: {
    /**
     * @function 登录code
     */
    async getLoginCode () {
      if (this.apiStatus.loginCode) return
      this.apiStatus.loginCode = true
      const [loginRes] = await TaroAsync(Taro.login)
      console.log('code', loginRes.code)
      this.apiStatus.loginCode = false
      if (loginRes.code) {
        this.loginCode.code = loginRes.code
        this.loginCode.timestamp = +new Date()
      }
      return loginRes.code || ''
    },
    checkLoginCode () {
      if (this.userInfo.isBind === 0 && !this.loginCode.code) {
        this.getLoginCode()
      }
    },
    /**
     * @function 检查登录信息
     */
    async checkLoginState () {
      const token = this.userInfo.token || getUserInfo('token')
      if (!token) {
        this.isNeedLogin = true
        return [{}, null]
      }
      const [res] = await apis.checkLoginState()
      if (res.code === '0') {
        this.isNeedLogin = false
        this.setUserInfo(Object.assign(this.userInfo, res.result || {}))
      }
      return [res, null]
    },
    /**
     * @function 登录
     */
    async login (params = {}) {
      const code = await this.getLoginCode()
      if (!code) {
        Taro.showToast({
          icon: 'none',
          title: '获取code失败'
        })
        return [{ message: '获取code失败' }, null]
      }
      const [res, err] = await apis.login({ alipay_auth_code: code, ...params })
      if (res.code === '0') {
        const data = res.result || {}
        this.setUserInfo(Object.assign(this.userInfo, data, { needAuth: '1' }))
        this.isNeedLogin = false
      } else {
        Taro.showToast({
          icon: 'none',
          title: res.message || '登录失败'
        })
      }
      this.loginCode.code = ''
      this.loginCode.timestamp = 0
      return [res, err]
    },
    /**
     * @function 获取用户信息
     */
    async getUserInfo () {
      const [res] = await apis.getUserInfo()
      if (res.status === 200) {
        this.setUserInfo({
          ...this.userInfo,
          ...res.data
        })
      }
    },
    /**
     * @function 绑定用户信息
     */
    async bindUserInfo (params = {}) {
      // const data = {}
      // Object.keys(params).forEach(key => {
      //   if (params[key]) {
      //     data[key] = params[key]
      //   }
      // })
      // if (!params.code && this.loginCode.code) {
      //   params.code = this.loginCode.code
      // }
      // const [res] = await apis.bindUserInfo(data)
      // if (res.code === '0') {
      //   const data = res.result || {}
      //   this.setUserInfo(Object.assign(this.userInfo, data, { needAuth: '0' }))
      //   this.loginCode.code = ''
      //   this.loginCode.timestamp = 0
      // } else {
      //   Taro.showToast({
      //     icon: 'none',
      //     title: res.message || '绑定用户信息失败'
      //   })
      //   if (this.loginCode.code) {
      //     this.getLoginCode()
      //   }
      // }
      return this.login({ ...params })
    },
    /**
     * @function 支付宝授权
     */
    async getAuthCode (scopes = 'auth_user') {
      return new Promise(resolve => {
        // Taro没有暴露getAuthCode接口
        my.getAuthCode({
          scopes,
          complete: (res) => {
            if (!res.authCode) {
              // 非用户拒绝授权错误
              if (res.error !== 11) {
                Taro.showToast({
                  icon: 'none',
                  title: res.errorMessage || '授权失败'
                })
              }
              return resolve([{}, res])
            }
            resolve([res, null])
          }
        })
      })
    },
    /**
     * @function 绑定用户手机号
     */
    async bindUserPhone (data) {
      return [{}, null]
    },
    /**
     * @function 更新用户信息
     */
    setUserInfo (userInfo) {
      this.userInfo = userInfo
      setUserInfo(userInfo)
    },
    /**
     * @function 退出登录
     */
    logout () {
      this.isNeedLogin = true
      this.setUserInfo({})
      clearUserInfo()
    }
  }
})
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
      // console.log('code', loginRes.code)
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
      if (res.status === 200) {
        this.isNeedLogin = false
        this.setUserInfo(Object.assign(this.userInfo, res.result || {}))
      }
      return [res, null]
    },
    /**
     * @function 登录
     */
    async login (params = {}) {
      let code = params.code || ''
      if (!code) {
        const loginCode = await this.getLoginCode()
        if (!loginCode) {
          Taro.showToast({
            icon: 'none',
            title: '获取code失败'
          })
          return [{ message: '获取code失败' }, null]
        }
        code = loginCode
      }
      const [res, err] = await apis.login({ alipay_auth_code: code, ...params })
      if (res.status === 200) {
        const data = res.data || {}
        if (data.access_token) {
          this.setUserInfo(Object.assign(this.userInfo, { token: data.access_token }, {
            needAuth: params.is_user_page === '1' ? '0' : '1'
          }))
          this.isNeedLogin = false
        }
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
    async bindUserInfo () {
      const [res] = await this.getAuthCode()
      if (!res.authCode) {
        return [{ message: '获取code失败' }, null]
      }
      return this.login({ code: res.authCode, is_user_page: '1' })
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
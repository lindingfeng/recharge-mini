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
        return [{ message: '获取登录code失败' }, null]
      }
      const [res, err] = await apis.login({ code, ...params })
      if (res.code === '0') {
        this.setUserInfo(res.result || {})
        this.isNeedLogin = false
        this.loginCode.code = ''
        this.loginCode.timestamp = 0
      }
      return [res, err]
    },
    /**
     * @function 绑定用户信息
     */
    async bindUserInfo ({ iv, encryptedData }) {
      const [res] = await apis.bindUserInfo({
        iv,
        encryptedData,
        code: this.loginCode.code
      })
      if (res.code === '0') {
        this.setUserInfo(Object.assign(this.userInfo, res.result || {}))
        this.loginCode.code = ''
        this.loginCode.timestamp = 0
      } else {
        this.getLoginCode()
      }
      return [res, null]
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
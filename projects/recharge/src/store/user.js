import { defineStore } from 'pinia'
import { useGlobalStore } from '@global/common/store'
import { useGlobalUserStore } from '@global/common/store/user'
import { getUserInfo, setUserInfo, clearUserInfo } from '@global/helper/loginManage'
import apis from '@global/apis/recharge'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getUserInfo()
  }),
  actions: {
    /**
     * @function 小程序登录
     * @param {Object} params 登录参数
     */
    async login (params = {}) {
      const globalStore = useGlobalStore()
      const globalUserStore = useGlobalUserStore()
      return globalUserStore.login({
        ...params,
        ...globalStore.inviteInfo
      })
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
      this.setUserInfo({})
      clearUserInfo()
    }
  }
})
import { defineStore } from 'pinia'
import { useGlobalStore } from '@global/common/store'
import { useGlobalUserStore } from '@global/common/store/user'

export const useUserStore = defineStore('user', {
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
    }
  }
})
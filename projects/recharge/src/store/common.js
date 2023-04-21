import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'
import apis from '@global/apis/recharge'

export const useCommonStore = defineStore('common', {
  state: () => ({
    bannerList: [],
    countryList: [],
    rechargeList: [],
    carSources: [],
    carCategories: [],
    carCodes: [],
    selectCountry: {},
    messageNotice: '',
    contactUrl: '',
    countryPageInfo: {
      total: 0
    },
    status: {
      messageLoaded: false,
      bannerLoaded: false,
      currentCountryLoaded: false,
      noticeLoaded: false,
      rechargeLoading: false,
    }
  }),
  actions: {
    /**
     * @function 获取通知消息
     */
    async getMessageNotice () {
      if (this.status.messageLoaded) return
      const [res] = await apis.getMessageNotice()
      if (res.status === 200) {
        this.status.messageLoaded = true
        this.messageNotice = '林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔林叔叔' || res.data.notice || ''
      }
    },
    /**
     * @function 获取广告位
     */
    async getBannerList () {
      if (this.status.bannerLoaded) return
      const [res] = await apis.getBannerList()
      if (res.status === 200) {
        this.status.bannerLoaded = true
        this.bannerList = res.data || []
      }
    },
    /**
     * @function 获取当前所在国家
     */
    async getCurrentCountry () {
      if (this.status.currentCountryLoaded) return
      const [res] = await apis.getCurrentCountry()
      if (res.status === 200) {
        this.status.currentCountryLoaded = true
        const selectCountry = Taro.getStorageSync('select_country') || {}
        this.selectCountry = selectCountry.iso2 ? selectCountry : res.data || {}
        this.getServices()
      }
    },
    /**
     * @function 获取所有国家
     */
    async getAllCountry () {
      if (this.countryList.length) return
      const [res] = await apis.getAllCountry()
      if (res.status === 200) {
        this.countryList = res.data || []
        this.countryPageInfo.total = this.countryList.length
      }
    },
    /**
     * @function 获取选中国家的服务
     */
    async getServices () {
      if (!this.selectCountry.iso3) return
      this.status.rechargeLoading = true
      const [res] = await apis.getServices({
        country_iso3: this.selectCountry.iso3
      })
      this.status.rechargeLoading = false
      if (res.status === 200) {
        this.rechargeList = res.data || []
      } else {
        Taro.showToast({
          icon: 'none',
          title: res.message || '获取充值服务失败'
        })
      }
    },
    /**
     * @function 获取客服二维码
     */
    async getConTactQrcode () {
      if (this.contactUrl) return
      const [res] = await apis.getConTactQrcode({
        country_iso3: this.selectCountry.iso3
      })
      if (res.status === 200) {
        this.contactUrl = res.data.qrcode || ''
      }
    },
    /**
     * @function 获取车辆属地列表
     */
    async getCarSources (callBack) {
      if (this.carSources.length) {
        return callBack && callBack(this.carSources)
      }
      const [res] = await apis.getCarSources()
      if (res.status === 200) {
        const list = res.data || []
        list.forEach(item => {
          item.type = 'possession'
          item.name = item.name_zh
        })
        this.carSources = list
        return callBack && callBack(list)
      }
    },
    /**
     * @function 获取车辆分类列表
     */
    async getCarCategories (callBack) {
      if (this.carCategories.length) {
        return callBack && callBack(this.carCategories)
      }
      const [res] = await apis.getCarCategories()
      if (res.status === 200) {
        const list = res.data || []
        list.forEach(item => {
          item.type = 'type'
          item.name = item.name_zh
        })
        this.carCategories = list
        return callBack && callBack(list)
      }
    },
    /**
     * @function 获取车牌代码列表
     */
    async getCarCodes (params = {}, callBack) {
      const [res] = await apis.getCarCodes(params)
      if (res.status === 200) {
        let list = res.data.plate_codes || []
        list = list.map(item => {
          return {
            type: 'license',
            name: item
          }
        })
        this.carCodes = list
        callBack && callBack(list)
      } else {
        this.carCodes = []
      }
    },
    /**
     * @function 获取未读弹窗
     */
    async getNotice () {
      if (this.status.noticeLoaded) return
      const [res] = await apis.getNotice()
      if (res.status === 200) {
        this.status.noticeLoaded = true
        if (res.data['id']) {
          Taro.showModal({
            title: res.data.popup_title || '提示',
            content: res.data.popup_text || '暂无内容',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#218CFF'
          })
        }
      }
    },
    /**
     * @function 校验充值手机号
     */
    async checkAccount (params = {}) {
      return apis.checkAccount(params)
    },
    /**
     * @function 充值示例手机号
     */
    async getExamples (params = {}) {
      return apis.getExamples(params)
    }
  }
})

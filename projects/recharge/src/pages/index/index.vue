<template>
  <view class="home-page">
    <message-notice
      v-if="baseCommonStore.messageNotice"
      color="#218CFF"
      background="rgba(255, 255, 255, 0.6)"
      :text="baseCommonStore.messageNotice"
    />
    <view class="home-main">
      <country-input-group
        :list="baseCommonStore.countryList"
        :loading="baseCommonStore.status.rechargeLoading"
      />
      <recharge-category-group
        class="home-recharge"
        :list="baseCommonStore.rechargeList"
        :loading="baseCommonStore.status.rechargeLoading"
        @category="toRecharge"
      />
      <base-swiper
        v-if="baseCommonStore.bannerList.length"
        class="home-banner"
        :height="Taro.pxTransform(120)"
        :list="baseCommonStore.bannerList"
      />
    </view>
  </view>
</template>

<script setup>
import { useCommonStore } from '@/store/common'
import MessageNotice from '@/components/message-notice'
import CountryInputGroup from '@/components/country-input-group'
import RechargeCategoryGroup from '@/components/recharge-category-group'
import BaseSwiper from '@global/components/base-swiper'
import Taro, { useDidShow } from '@tarojs/taro'

const baseCommonStore = useCommonStore()

function toRecharge (item) {
  const querys = [
    `iso2=${baseCommonStore.selectCountry.iso2 || ''}`,
    `iso3=${baseCommonStore.selectCountry.iso3 || ''}`,
    `service_id=${item.service_id}`,
    `calling_code=${baseCommonStore.selectCountry.calling_code || ''}`
  ].join('&')
  switch (item.service_id) {
    case 'mobile_phone_credits':
      Taro.navigateTo({ url: `/pages/recharge/phone/index?${querys}` })
      break;
    case 'mobile_phone_data':
      Taro.navigateTo({ url: `/pages/recharge/flow/index?${querys}` })
      break;
    case 'internet_credits':
    case 'landline_credits':
    case 'nol_credits':
      Taro.navigateTo({ url: `/pages/recharge/network-fix-nol/index?${querys}` })
      break;
    case 'prepaid_card_credits':
      Taro.navigateTo({ url: `/pages/recharge/card/index?${querys}` })
      break;
    case 'salik_pin':
      Taro.navigateTo({ url: `/pages/recharge/salik/index?${querys}` })
      break;
    case 'dubai_fine':
      Taro.navigateTo({ url: `/pages/recharge/traffic/index?${querys}` })
      break;
  }
}

useDidShow(() => {
  // console.log('useDidShow', process.env.VUE_APP_PROJECT)
  // h5用户
  // Taro.setStorageSync('recharge_ui', {"token":"96b4567531a0b820a5d5bf377e63e847"})
  // 微信用户
  Taro.setStorageSync('recharge_ui', {"token":"281b05086776bd39fc269b978aebfd6d","id":6,"openid":"oMnqI5w4JyDMGZvYth7OVz66jqRQ","nickname":"林帅帅","headimgurl":"https://thirdwx.qlogo.cn/mmopen/vi_32/xcd2gPUyCyfKge7iaoHbcE0ISUV1wZufLKiaIIrjjeXnWYugUdvkE7HXDHKXHWxK0JkxhoicU9qee7zs7XZT524Hw/132","agent_openid":"","create_at":"2023-01-07 10:13:43"})
  // Taro.setStorageSync('recharge_ui', {"token":"666","id":6,"openid":"oMnqI5w4JyDMGZvYth7OVz66jqRQ","nickname":"林帅帅","headimgurl":"https://thirdwx.qlogo.cn/mmopen/vi_32/xcd2gPUyCyfKge7iaoHbcE0ISUV1wZufLKiaIIrjjeXnWYugUdvkE7HXDHKXHWxK0JkxhoicU9qee7zs7XZT524Hw/132","agent_openid":"","create_at":"2023-01-07 10:13:43"})
  baseCommonStore.getCurrentCountry()
  baseCommonStore.getAllCountry()
  baseCommonStore.getBannerList()
  baseCommonStore.getMessageNotice()
  baseCommonStore.getNotice()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

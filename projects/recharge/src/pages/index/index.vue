<template>
  <view class="home-page">
    <notice-bar
      v-if="baseCommonStore.messageNotice"
      :text="baseCommonStore.messageNotice"
    />
    <view class="home-main">
      <country-input-group
        :list="baseCommonStore.countryList"
        :loading="baseCommonStore.status.rechargeLoading"
      />
      <recharge-category-group
        :list="baseCommonStore.rechargeList"
        :loading="baseCommonStore.status.rechargeLoading"
        class="home-recharge"
        @category="toRecharge"
      />
      <base-swiper
        v-if="baseCommonStore.bannerList.length"
        :height="Taro.pxTransform(120)"
        :list="baseCommonStore.bannerList"
        class="home-banner"
      />
    </view>
  </view>
</template>

<script setup>
import { useCommonStore } from '@/store/common'
import NoticeBar from '@/components/notice-bar'
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
  const navigateMap = {
    'mobile_phone_credits': '/pages/recharge/phone/index',
    'mobile_phone_data': '/pages/recharge/flow/index',
    'internet_credits': '/pages/recharge/network-fix-nol/index',
    'landline_credits': '/pages/recharge/network-fix-nol/index',
    'nol_credits': '/pages/recharge/network-fix-nol/index',
    'prepaid_card_credits': '/pages/recharge/card/index',
    'salik_pin': '/pages/recharge/salik/index',
    'dubai_fine': '/pages/recharge/traffic/index'
  }
  if (navigateMap[item.service_id]) {
    Taro.navigateTo({ url: `${navigateMap[item.service_id]}?${querys}` })
  }
}

useDidShow(() => {
  Taro.setStorageSync('recharge_ui', {"token":"c29e3650bd4e853ecea29b75c315a978","id":6,"openid":"oMnqI5w4JyDMGZvYth7OVz66jqRQ","nickname":"林帅帅","headimgurl":"https://thirdwx.qlogo.cn/mmopen/vi_32/xcd2gPUyCyfKge7iaoHbcE0ISUV1wZufLKiaIIrjjeXnWYugUdvkE7HXDHKXHWxK0JkxhoicU9qee7zs7XZT524Hw/132","agent_openid":"","create_at":"2023-01-07 10:13:43"})
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

<template>
  <view class="home-page">
    <!-- <image
      mode="widthFix"
      src="https://s1.huishoubao.com/static/test/qqf-introduce-v2.png"
      :style="{
        width: '100%',
        height: 'auto'
      }"
    /> -->
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
import { useGlobalUserStore } from '@global/common/store/user'
import CountryInputGroup from '@/components/country-input-group'
import RechargeCategoryGroup from '@/components/recharge-category-group'
import BaseSwiper from '@global/components/base-swiper'
import Taro, { useDidShow } from '@tarojs/taro'

const globalUserStore = useGlobalUserStore()

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

useDidShow(async () => {
  if (!globalUserStore.userInfo.token) {
    await globalUserStore.login()
  }
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

<template>
  <view class="user-page">
    <view class="user-info-content">
      <view class="user-info">
        <image mode="widthFix" class="icon-user-bg" src="@/assets/imgs/common/icon_user_bg.png" />
        <view class="user-info-bg">
          <view class="user-avatar">
            <image
              v-if="globalUserStore.userInfo.headimgurl"
              class="icon-avatar"
              :src="globalUserStore.userInfo.headimgurl"
            />
          </view>
          <view class="user-name">{{ globalUserStore.userInfo.nickname }}</view>
        </view>
      </view>
    </view>
    <view class="menu-cell-group">
      <view
        v-for="(item, index) in funcList"
        :key="index"
        class="menu-cell"
        @click="Taro.navigateTo({ url: index == 1 ? '/pages/promote/index' : '/pages/recharge/list/index' || item.function_uri })"
      >
        <view class="menu-cell-image">
          <image class="icon-menu" :src="item.function_icon_url" />
        </view>
        <view class="menu-cell-name">{{ item.function_desc }}</view>
        <image class="icon-right" src="@/assets/imgs/common/icon_right.png" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useGlobalUserStore } from '@global/common/store/user'
import { useGlobalStore } from '@global/common/store'
import apis from '@global/apis/recharge'

const globalStore = useGlobalStore()

const globalUserStore = useGlobalUserStore()

const funcList = ref([])

const needAuth = computed(() => {
  return globalStore.env === 'alipay' && globalUserStore.userInfo.needAuth === '1'
})

async function getUserFunction () {
  const [res] = await apis.getUserFunction()
  if (res.status === 200) {
    funcList.value = res.data || []
  }
}

async function bindUserInfo () {
  if (needAuth.value) {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const [res] = await globalUserStore.getAuthCode()
    if (res.authCode) {
      await globalUserStore.bindUserInfo({
        code: res.authCode
      })
    }
    Taro.hideLoading()
  }
}

useLoad(() => {
  bindUserInfo()
})

useDidShow(() => {
  // 获取成功示例
  // {response: '{"response":{"code":"10000","msg":"Success","avatar":"https://tfs.alipayobjects.com/images/partner/T1Z3FcXkdUXXXXXXXX","city":"","countryCode":"","gender":"","nickName":"有趣的人类","province":""}}'}
  // 获取失败示例
  // {response: '{"response":{"code":"40003","msg":"Insufficient Conditions","subCode":"isv.invalid-auth-relations","subMsg":"无效的授权关系"}}'}
  // Taro.getOpenUserInfo({
  //   complete: (res) => {
  //     console.log(res)
  //   }
  // })
  globalUserStore.getUserInfo()
  getUserFunction()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

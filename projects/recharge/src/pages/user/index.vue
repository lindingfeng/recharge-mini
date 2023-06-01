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
          <view class="user-name">{{ globalUserStore.userInfo.nickname || defaultNickname }}</view>
        </view>
      </view>
    </view>
    <view class="menu-cell-group">
      <view
        v-for="(item, index) in funcList"
        :key="index"
        class="menu-cell"
        @click="Taro.navigateTo({ url: item.function_uri })"
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
import Taro, { useDidShow } from '@tarojs/taro'
import { useGlobalUserStore } from '@global/common/store/user'
import { useGlobalStore } from '@global/common/store'
import apis from '@global/apis/recharge'
import { envMap } from '@/config'

const globalStore = useGlobalStore()

const globalUserStore = useGlobalUserStore()

const funcList = ref([])

const defaultNickname = computed(() => {
  return envMap[globalStore.env]?.DEFAULT_NICKNAME || ''
})

const needAuth = computed(() => {
  return globalStore.env === 'alipay' && globalUserStore.userInfo.needAuth === '1'
})

async function getUserFunction () {
  const [res] = await apis.getUserFunction()
  if (res.status === 200) {
    funcList.value = res.data || []
  }
}

async function getUserInfo () {
  if (needAuth.value) {
    const [res] = await globalUserStore.bindUserInfo()
    if (res.data?.access_token) {
      globalUserStore.getUserInfo()
    }
  } else {
    globalUserStore.getUserInfo()
  }
}

useDidShow(() => {
  getUserFunction()
  getUserInfo()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

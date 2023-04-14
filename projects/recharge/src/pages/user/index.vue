<template>
  <view class="user-page">
    <view class="user-info-content">
      <view class="user-info">
        <image mode="widthFix" class="icon-user-bg" src="@/assets/imgs/common/icon_user_bg.png" />
        <view class="user-info-bg">
          <view class="user-avatar">
            <image
              v-if="baseUserStore.userInfo.headimgurl"
              class="icon-avatar"
              :src="baseUserStore.userInfo.headimgurl"
            />
          </view>
          <view class="user-name">{{ baseUserStore.userInfo.nickname }}</view>
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
import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { useUserStore } from '@/store/user'
import apis from '@global/apis/recharge'

const baseUserStore = useUserStore()

const funcList = ref([])

async function getUserFunction () {
  const [res] = await apis.getUserFunction()
  if (res.status === 200) {
    funcList.value = res.data || []
  }
}

useDidShow(() => {
  baseUserStore.getUserInfo()
  getUserFunction()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

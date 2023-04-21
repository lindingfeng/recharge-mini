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
      <!-- <button open-type="getAuthorize" scope="userInfo" @getAuthorize="getAuthorize">获取用户信息</button> -->
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

// function getAuthorize (e) {
//   console.log('getauthorize', e)
//   Taro.getOpenUserInfo({
//     complete: (res) => {
//       console.log(res)
//     }
//   })
// }

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
  baseUserStore.getUserInfo()
  getUserFunction()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

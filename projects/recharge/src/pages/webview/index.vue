<template>
  <view class="webview-page">
    <web-view :src="data.webUrl" />
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { useGlobalUserStore } from '@global/common/store/user'
import Taro, { useLoad } from '@tarojs/taro'

const globalUserStore = useGlobalUserStore()

const pageInstance = Taro.getCurrentInstance()

const data = reactive({
  webUrl: ''
})

async function beforeLoadWebview () {
  const { webUrl, isLogin = 1 } = pageInstance.router.params
  if (isLogin && !globalUserStore.userInfo.token) {
    await globalUserStore.login()
  }
  let url = decodeURIComponent(webUrl || '')
  if (!url) {
    return Taro.showToast({
      icon: 'none',
      title: '访问链接不能为空'
    })
  }
  url += `${url.indexOf('?') !== -1 ? '&' : '?'}access_token=${globalUserStore.userInfo.token || ''}&rechage_from=wechatMini`
  data.webUrl = url
}

useLoad(() => {
  beforeLoadWebview()
})

</script>

<style lang="scss"></style>

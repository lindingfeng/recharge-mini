<template>
  <view class="user-phone-button-component">
    <base-button
      v-if="!needAuth"
      :loading="loading"
      @click="$emit('click')"
    >
      <slot />
    </base-button>
    <base-button
      v-else
      open-type="getPhoneNumber"
      :loading="authLoading"
      @getphonenumber	="getPhoneNumber"
      @error="authLoading = false"
      @click="authLoading = true"
    >
      <slot />
    </base-button>
  </view>
</template>

<script>
export default {
  name: 'user-phone-button'
}
</script>

<script setup>
import { ref } from 'vue'
import { useGlobalUserStore } from '@global/common/store/user'
import BaseButton from '@global/components/base-button/index'
import Taro from '@tarojs/taro'

const props = defineProps({
  needAuth: Boolean,
  loading: Boolean
})

const emits = defineEmits(['click', 'updated'])

const globalUserStore = useGlobalUserStore()

const authLoading = ref(false)

/**
 * @function 获取用户手机号加密信息
 * 基础库2.21.2及以上版本微信对获取手机号的接口进行了安全升级
 * @document https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
 */
function getPhoneNumber (e) {
  const { errMsg, encryptedData, iv } = e.detail

  if (errMsg === 'getPhoneNumber:fail user deny') {
    authLoading.value = false
    return
  }

  if (!encryptedData || !iv) {
    authLoading.value = false
    return Taro.showToast({
      icon: 'none',
      title: '获取手机号信息失败'
    })
  }
  bindUserPhone(e.detail)
}

async function bindUserPhone (userInfo) {
  const [updateRes] = await globalUserStore.bindUserPhone(userInfo)
  
  authLoading.value = false

  if (updateRes.code !== '0') {
    return Taro.showToast({
      icon: 'none',
      title: updateRes._errStr || '更新手机号信息失败'
    })
  }
  emits('updated')
}

</script>
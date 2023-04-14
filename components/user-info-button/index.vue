<template>
  <view class="user-info-button-component">
    <view v-if="buttonType === 'button'">
      <base-button
        v-if="!needAuth"
        :loading="loading"
        :disabled="disabled"
        @click="$emit('click')"
      >
        <slot />
      </base-button>
      <base-button
        v-else-if="supportUserProfile"
        :loading="authLoading"
        :disabled="disabled"
        @click="getUserProfile"
      >
        <slot />
      </base-button>
      <base-button
        v-else
        open-type="getUserInfo"
        :loading="authLoading"
        :disabled="disabled"
        @getuserinfo="getUserInfo"
        @error="authLoading = false"
        @click="authLoading = true"
      >
        <slot />
      </base-button>
    </view>
    <view v-else-if="buttonType === 'none'">
      <button
        v-if="!needAuth"
        hover-class="none"
        :disabled="disabled || loading"
        class="native-button"
        @click="$emit('click')"
      >
        <slot />
      </button>
      <button
        v-else-if="supportUserProfile"
        hover-class="none"
        :disabled="disabled || authLoading"
        class="native-button"
        @click="getUserProfile"
      >
        <slot />
      </button>
      <button
        v-else
        hover-class="none"
        open-type="getUserInfo"
        :disabled="disabled || authLoading"
        class="native-button"
        @getuserinfo="getUserInfo"
        @error="authLoading = false"
        @click="authLoading = true"
      >
        <slot />
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'user-info-button'
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { TaroAsync } from '@global/common/taro'
import { useGlobalUserStore } from '@global/common/store/user'
import BaseButton from '@global/components/base-button/index'
import Taro from '@tarojs/taro'

const props = defineProps({
  buttonType: {
    type: String,
    default: 'button'
  },
  needAuth: Boolean,
  disabled: Boolean,
  loading: Boolean
})

const emits = defineEmits(['click', 'updated'])

const globalUserStore = useGlobalUserStore()

const authLoading = ref(false)

const supportUserProfile = computed(() => !!Taro.getUserProfile)

/**
 * @function 新版获取用户接口
 * 基础库2.27.1及以上版本微信收回该接口获取用户头像昵称能力（傻逼腾讯）
 * @document https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
 * @notice https://developers.weixin.qq.com/community/develop/doc/00022c683e8a80b29bed2142b56c01
 */
async function getUserProfile () {
  authLoading.value = true

  const [userInfo, error] = await TaroAsync(Taro.getUserProfile, {
    desc: '请求获取您的昵称、头像'
  })

  if (error) {
    authLoading.value = false
    if (error.errMsg !== 'getUserProfile:fail auth deny') {
      Taro.showToast({
        icon: 'none',
        title: '获取用户信息失败'
      })
    }
    return false
  }

  bindUserInfo(userInfo)
}

function getUserInfo (e) {
  const { errMsg, encryptedData, iv } = e.detail || {}

  if (errMsg === 'getUserInfo:fail auth deny') {
    authLoading.value = false
    return false
  }

  if (!encryptedData || !iv) {
    authLoading.value = false
    return Taro.showToast({
      icon: 'none',
      title: '获取用户信息失败'
    })
  }
  bindUserInfo(e.detail)
}

async function bindUserInfo (userInfo) {
  const [updateRes] = await globalUserStore.bindUserInfo(userInfo)
  
  authLoading.value = false

  if (updateRes.code !== '0') {
    return Taro.showToast({
      icon: 'none',
      title: updateRes._errStr || '更新用户信息失败'
    })
  }
  emits('updated')
}

</script>

<style lang="scss">
.user-info-button-component {
  .native-button {
    padding: 0;
    margin: 0;
    line-height: normal;
    background-color: transparent;
    &::after {
      border: 0;
    }
    &[disabled] {
      opacity: .68;
      color: inherit;
    }
  }
}
</style>
<template>
  <view class="recharge-input-group-component">
    <view class="recharge-input">
      <slot name="header-header">
        <view class="recharge-input-header">
          <view v-if="exampleInfo.calling_code || query.calling_code" class="recharge-input-areacode">+{{ exampleInfo.calling_code || query.calling_code || '' }}</view>
          <nut-input
            v-model="inputs"
            type="tel"
            :border="false"
            :disabled="data.loading"
            placeholder="请输入手机号码"
            placeholder-class="recharge-input-group-placeholder"
            class="recharge-input-group-input"
            @blur="checkAccount"
          />
        </view>
      </slot>
      <slot name="header-body">
        <view class="recharge-input-body">
          <view class="recharge-input-left">
            <view class="recharge-input-verify">
              <!-- <image class="icon-verify" src="@/assets/imgs/common/icon_verify.png" /> -->
              <text class="verify-title">运营商：</text>
              <view class="verify-result">
                <text v-if="data.loading" class="green">识别中...</text>
                <view v-else-if="operatorInfo.is_valid === true" class="operator-content">
                  <image
                    v-if="operatorInfo.operator_logo_url"
                    class="icon-operator"
                    :src="operatorInfo.operator_logo_url"
                  />
                  <text class="operator-name">{{ operatorInfo.operator_name }}</text>
                </view>
                <text v-else-if="operatorInfo.is_valid === false" class="red">无效手机号</text>
                <text v-else>--</text>
              </view>
              <view
                v-if="showOperatorButton && !data.loading && operatorInfo.is_valid === true"
                class="change-operator"
                @click="$emit('operator')"
              >
                <text class="change-text">更换</text>
                <image class="icon-change" src="@/assets/imgs/common/icon_operator_change.png" />
              </view>
            </view>
          </view>
          <view class="recharge-input-example">示例：{{ exampleInfo.phone_number || '-' }}</view>
        </view>
      </slot>
    </view>
    <slot name="header-footer">
      <view v-if="footerTips" class="recharge-input-footer">{{ footerTips }}</view>
    </slot>
  </view>
</template>

<script>
export default {
  name: 'recharge-input-group'
}
</script>

<script setup>
import Taro from '@tarojs/taro'
import { reactive, computed } from 'vue'
import { useCommonStore } from '@/store/common'

const pageInstance = Taro.getCurrentInstance()

const query = pageInstance.router.params

const baseCommonStore = useCommonStore()

const props = defineProps({
  input: String,
  footerTips: String,
  showOperatorButton: {
    type: Boolean,
    default: true
  },
  exampleInfo: Object,
  operatorInfo: Object
})

const emits = defineEmits([
  'update:input',
  'phone-pass',
  'phone-no-pass',
  'operator'
])

const data = reactive({
  loading: false
})

const inputs = computed({
  get () {
    return props.input
  },
  set (value) {
    emits('update:input', value)
  }
})

async function checkAccount () {
  if (inputs.value.length < 2) {
    return emits('phone-no-pass', {})
  }
  data.loading = true
  const [res] = await baseCommonStore.checkAccount({
    country_iso2: query.iso2,
    phone_number: inputs.value,
    service_id: query.service_id,
  })
  data.loading = false
  if (res.status === 200) {
    if (res.data.is_valid) {
      if (res.data.format_phone_number) {
        inputs.value = res.data.format_phone_number
      }
      emits('phone-pass', res.data)
    } else {
      emits('phone-no-pass', res.data)
    }
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '校验手机号失败'
    })
    emits('phone-no-pass', {})
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>


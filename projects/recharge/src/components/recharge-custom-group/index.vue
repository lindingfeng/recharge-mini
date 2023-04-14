<template>
  <view class="recharge-custom-group-component">
    <base-header
      :title="title"
      class="recharge-custom-header"
    >
      <template #header-right>
        <view v-if="rightText" class="recharge-custom-query" @click="$emit('title-right', inputs)">
          <text>{{ rightText }}</text>
          <image class="icon-right" src="@/assets/imgs/common/icon_more.png" />
        </view>
      </template>
    </base-header>
    <slot name="recharge-tips" />
    <view class="recharge-custom-body">
      <nut-input
        v-model="inputs"
        :border="false"
        v-bind="inputAttr"
        placeholder-class="recharge-custom-placeholder"
        class="recharge-custom-input"
      />
      <view v-if="rechargeTips" class="recharge-custom-tips">{{ rechargeTips }}</view>
      <base-button
        v-bind="buttonAttr"
        class="recharge-custom-button"
        @click="$emit('recharge', inputs)"
      >
        {{ rechargeButtonText }}
      </base-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'recharge-custom-group'
}
</script>

<script setup>
import { computed } from 'vue'
import BaseHeader from '@/components/base-header'
import BaseButton from '@global/components/base-button'

const props = defineProps({
  input: String,
  title: String,
  rightText: String,
  inputAttr: Object,
  buttonAttr: Object,
  rechargeTips: String,
  rechargeButtonText: {
    type: String,
    default: '充值'
  },
})

const emits = defineEmits([
  'update:input',
  'title-right',
  'recharge'
])

const inputs = computed({
  get () {
    return props.input
  },
  set (value) {
    emits('update:input', value)
  }
})

</script>

<style lang="scss">
@import './index.scss';
</style>


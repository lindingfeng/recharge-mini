<template>
  <base-popup
    v-model="popupStatus"
    :close-on-click-overlay="false"
  >
    <view class="base-confirm-component">
      <view class="base-confirm-header">
        <view class="base-confirm-title">{{ title }}</view>
        <view
          class="base-confirm-close"
          @click="popupStatus = false"
        >
          <image
            class="icon-close"
            src="@/assets/imgs/common/icon_popup_close.png"
          />
        </view>
      </view>
      <slot name="body">
        <view class="base-confirm-body">
          <slot name="body-content" />
        </view>
      </slot>
      <base-button
        v-if="showConfirm"
        class="base-confirm-button"
        v-bind="$attrs"
        @click="confirm"
      >
        {{ confirmText }}
      </base-button>
    </view>
  </base-popup>
</template>

<script>
export default {
  name: 'base-confirm'
}
</script>

<script setup>
import { computed } from 'vue'
import BasePopup from '@global/components/base-popup'
import BaseButton from '@global/components/base-button'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  showConfirm: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '我知道了'
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits([
  'confirm',
  'update:modelValue'
])

const popupStatus = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emits('update:modelValue', value)
  }
})

function confirm () {
  if (props.autoClose) {
    popupStatus.value = false
  }
  emits('confirm')
}

</script>

<style lang="scss">
@import './index.scss';
</style>
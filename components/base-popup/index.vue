<template>
  <nut-popup
    v-model:visible="popupStatus"
    class="base-popup-component"
    v-bind="$attrs"
  >
    <slot />
  </nut-popup>
</template>

<script>
export default {
  name: 'base-popup'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '标题'
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['update:modelValue'])

const popupStatus = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emits('update:modelValue', value)
  }
})

</script>

<style lang="scss">
.base-popup-component {
  .nut-popup {
    overflow: hidden;
    &.nut-popup--center {
      background-color: transparent;
    }
    &.nut-popup--bottom {
      width: 100%;
      border-radius: 6px 6px 0 0;
    }
  }
  .base-popup-header {
    position: relative;
    width: 100%;
    text-align: center;
    height: 62px;
    line-height: 62px;
    .base-popup-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-close {
      width: 100%;
      height: 100%;
    }
    .base-popup-title {
      font-size: 16px;
      font-weight: bold;
      color: #2C2C2C;
    }
  }
}
</style>
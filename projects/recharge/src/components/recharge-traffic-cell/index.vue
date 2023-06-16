<template>
  <view
    class="recharge-traffic-cell-component"
    @click="$emit('click')"
  >
    <view class="recharge-traffic-title">{{ title }}</view>
    <view v-if="type === 'view'" class="recharge-traffic-view-input">
      <text v-if="$attrs.modelValue" class="recharge-traffic-input">{{ $attrs.modelValue }}</text>
      <text v-else class="recharge-traffic-placeholder">{{ $attrs.placeholder || '' }}</text>
    </view>
    <nut-input
      v-else
      :border="false"
      v-bind="$attrs"
      placeholder-class="recharge-traffic-cell-placeholder"
      class="recharge-traffic-cell-input"
    />
    <view v-if="showRightIcon" class="down-image">
      <image class="icon-down" src="@/assets/imgs/common/icon_down.png" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'recharge-traffic-cell'
}
</script>

<script setup>

defineProps({
  type: {
    type: String,
    default: 'input'
  },
  title: String,
  showRightIcon: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

</script>

<style lang="scss">
@import './index.scss';
</style>


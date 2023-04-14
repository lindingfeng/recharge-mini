<template>
  <view
    class="recharge-traffic-cell-component"
    @click="$emit('click')"
  >
    <view class="recharge-traffic-title">{{ title }}</view>
    <nut-input
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


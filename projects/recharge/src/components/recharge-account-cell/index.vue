<template>
  <view class="recharge-account-cell-component">
    <view class="recharge-account-title">{{ title }}</view>
    <nut-input
      :border="false"
      placeholder-class="recharge-account-cell-placeholder"
      v-bind="$attrs"
      class="recharge-account-cell-input"
    />
  </view>
</template>

<script>
export default {
  name: 'recharge-account-cell'
}
</script>

<script setup>

defineProps({
  title: String
})

</script>

<style lang="scss">
@import './index.scss';
</style>


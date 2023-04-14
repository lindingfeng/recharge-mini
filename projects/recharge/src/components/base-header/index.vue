<template>
  <view class="base-header-component">
    <view class="base-header-title">{{ title }}</view>
    <slot name="header-right" />
  </view>
</template>

<script>
export default {
  name: 'base-header'
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
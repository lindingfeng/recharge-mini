<template>
  <view class="recharge-base-group-component">
    <base-header
      v-if="title"
      :title="title"
      class="recharge-base-title"
    />
    <slot />
    <slot name="recharge-base-footer" />
  </view>
</template>

<script>
export default {
  name: 'recharge-base-group'
}
</script>

<script setup>
import BaseHeader from '@/components/base-header'

defineProps({
  title: String
})

</script>

<style lang="scss">
@import './index.scss';
</style>


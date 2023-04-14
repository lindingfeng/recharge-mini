<template>
  <view class="recharge-prompt-group-component">
    <view class="recharge-prompt-header">
      <image class="icon-prompt" src="@/assets/imgs/common/icon_prompt_tips.png" />
      <text>{{ title }}</text>
    </view>
    <slot />
  </view>
</template>

<script>
export default {
  name: 'recharge-prompt-group'
}
</script>

<script setup>

defineProps({
  title: {
    type: String,
    default: '温馨提示'
  }
})

</script>

<style lang="scss">
@import './index.scss';
</style>


<template>
  <nut-button
    type="primary"
    color="linear-gradient(90deg, #21B0FF 0%, #218CFF 100%)"
    block
    v-bind="$attrs"
    class="base-button-component"
  >
    <slot />
  </nut-button>
</template>

<script>
export default {
  name: 'base-button'
}
</script>

<script setup></script>

<style lang="scss">
.base-button-component {
  &.nut-button {
    height: 44px;
    font-size: 16px;
    font-weight: bold;
  }
  &.nut-button--round {
    border-radius: 22px;
  }
  &.nut-button--disabled {
    opacity: .5;
  }
}
</style>
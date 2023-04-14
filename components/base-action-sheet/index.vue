<template>
  <nut-action-sheet
    v-model:visible="popupStatus"
    v-bind="$attrs"
    class="base-action-sheet-component"
  />
</template>

<script>
export default {
  name: 'base-action-sheet'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emits = defineEmits([
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

</script>

<style lang="scss">
.base-action-sheet-component {
  .nut-action-sheet {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .nut-action-sheet__item {
    font-size: 16px;
  }
}
</style>
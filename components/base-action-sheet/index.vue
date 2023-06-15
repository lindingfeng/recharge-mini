<template>
  <nut-action-sheet
    v-model:visible="popupStatus"
    v-bind="$attrs"
    class="base-action-sheet-component"
  >
    <!-- <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template> -->
    <view class="base-action-sheet-slot">
      <scroll-view
        :scroll-y="true"
        class="actionSheet-scroll-view"
      >
        <view class="actionSheet-list">
          <view
            v-for="(item, index) in menuItems"
            :key="index"
            class="actionSheet-item"
            @click="choose(item, index)"
          >
            {{ item.name }}
          </view>
        </view>
      </scroll-view>
      <view class="actionSheet-cancel" @click="popupStatus = false">{{ cancelText }}</view>
    </view>
  </nut-action-sheet>
</template>

<script>
export default {
  name: 'base-action-sheet'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  menuItems: Array,
  modelValue: Boolean,
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emits = defineEmits([
  'update:modelValue',
  'choose'
])

const popupStatus = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emits('update:modelValue', value)
  }
})

function choose (item) {
  emits('update:modelValue', false)
  emits('choose', item)
}

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
  .actionSheet-scroll-view {
    max-height: 400px;
    .actionSheet-item {
      padding: 10px;
      text-align: center;
      line-height: 24px;
      font-size: 16px;
    }
  }
  .actionSheet-cancel {
    padding: 10px;
    margin-top: 5px;
    text-align: center;
    line-height: 24px;
    border-top: 1px solid #f6f6f6;
  }
}
</style>
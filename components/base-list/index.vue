<template>
  <view class="base-list-component">
    <slot />
    <view v-show="loading" class="data-loading">
      <slot name="loading">
        <Loading size="14px" color="#777777" class="data-loading-icon" />
        <view class="data-loading-text">{{ loadingText }}</view>
      </slot>
    </view>
    <view v-show="finished && !noData" class="data-finished">
      <slot name="finished">
        <view class="data-finished-text">{{ finishedText }}</view>
      </slot>
    </view>
    <view v-show="noData" class="data-no">
      <slot name="noData">
        <no-data :text="noDataText" />
      </slot>
    </view>
    <view v-show="error" class="data-error" @click="refresh">
      <view class="data-error-text">{{ errorText }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'base-list'
}
</script>

<script setup>
import { Loading } from '@nutui/icons-vue-taro';
import NoData from '@global/components/no-data/index'

defineProps({
  loading: Boolean,
  finished: Boolean,
  error: Boolean,
  noData: Boolean,
  loadingText: {
    type: String,
    default: '加载中'
  },
  finishedText: {
    type: String,
    default: '暂时没有更多了哦～'
  },
  noDataText: {
    type: String,
    default: '暂无内容'
  },
  errorText: {
    type: String,
    default: '加载失败，点击重新加载'
  }
})

const emits = defineEmits([
  'update:error',
  'refresh'
])

function refresh () {
  emits('update:error', false)
  emits('refresh')
}

</script>

<style lang="scss">
.base-list-component {
  position: relative;
  .data-loading, .data-finished, .data-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    .data-loading-icon {
      margin-right: 4px;
    }
    .data-loading-text,
    .data-finished-text,
    .data-error-text {
      font-size: 14px;
      color: #777777;
    }
  }
}
</style>
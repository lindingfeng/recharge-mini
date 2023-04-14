<template>
  <view class="finished-placeholder-component">
    <view class="finished-placeholder">
      <view v-if="noData" class="no-data">
        <image class="icon" src="@global/assets/imgs/common/icon_nodata.png" />
        <view class="no-data-text">暂无内容</view>
      </view>
      <view v-else class="no-more">暂时没有更多了哦～</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'finished-placeholder'
}
</script>

<script setup>

defineProps({
  noData: Boolean
})

</script>

<style lang="scss">
@import './index.scss';
</style>
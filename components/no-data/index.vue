<template>
  <view class="no-data-component">
    <view class="no-data-content">
      <image class="icon-null" src="@global/assets/imgs/common/icon_nodata.png" />
      <view class="null-text">{{ text }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'no-data'
}
</script>

<script setup>

defineProps({
  text: {
    type: String,
    default: '暂无内容'
  }
})

</script>

<style lang="scss">
.no-data-component {
  .no-data-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icon-null {
    width: 150px;
    height: 150px;
  }
  .null-text {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }
}
</style>
<template>
  <view class="message-notice-component">
    <nut-noticebar
      v-bind="$attrs"
    >
      <template #left-icon>
        <view class="message-notice-image">
          <image class="icon-message-notice" src="@/assets/imgs/common/icon_message_notice.png" />
        </view>
      </template>
    </nut-noticebar>
  </view>
</template>

<script>
export default {
  name: 'message-notice'
}
</script>

<style lang="scss">
.message-notice-component {
  .nut-noticebar__page {
    padding: 0 8px;
    height: 30px;
    .nut-noticebar__page-lefticon {
      margin: 0 8px 0 0;
    }
    .message-notice-image {
      display: flex;
      align-items: center;
      height: 100%;
      .icon-message-notice {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
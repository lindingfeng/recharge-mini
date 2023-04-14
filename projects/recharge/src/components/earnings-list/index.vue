<template>
  <view class="earnings-list-component">
    <view class="earnings-list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="earnings-item"
      >
        <view class="earnings-item-header">
          <view class="header-title">{{ item.amount_statement_name }}</view>
          <view class="header-prices">+{{ item.amount_for_humans }}元</view>
        </view>
        <view class="earnings-item-footer">
          <view class="footer-time">{{ item.created_at }}</view>
          <view class="footer-total">总金额：{{ item.balance_for_humans }}元</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'earnings-list'
}
</script>

<script setup>

defineProps({
  list: Array
})

</script>

<style lang="scss">
.earnings-list-component {
  .earnings-item {
    padding: 16px;
    margin-bottom: 12px;
    background: #FFFFFF;
    border-radius: 12px;
    .earnings-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      .header-prices {
        color: #218CFF;
      }
    }
    .earnings-item-footer {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #999999;
      .footer-total {
        font-size: 14px;
        color: #666666;
      }
    }
  }
}
</style>


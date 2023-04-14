<template>
  <view class="recharge-list-component">
    <view class="recharge-list-body">
      <view
        v-for="item in list"
        :key="item.pay_order_id"
        class="recharge-item"
        @click="$emit('detail', item)"
      >
        <view class="recharge-item-header">
          <view class="header-title">{{ item.service_name_zh }}</view>
          <view class="header-prices">¥{{ item.pay_real_amount }}</view>
        </view>
        <view class="recharge-item-body">{{ item.account }}</view>
        <view v-if="item.pin_code" class="recharge-item-body">{{ item.pin_code }}</view>
        <view class="recharge-item-footer">{{ item.created_at }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'recharge-list'
}
</script>

<script setup>

defineProps({
  list: Array
})

defineEmits(['detail'])

</script>

<style lang="scss">
.recharge-list-component {
  .recharge-list-body {
    .recharge-item {
      padding: 16px;
      margin-bottom: 16px;
      background: #FFFFFF;
      border-radius: 12px;
      &:last-child {
        margin-bottom: 0;
      }
      .recharge-item-header {
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
      .recharge-item-body {
        margin-top: 4px;
        font-size: 14px;
        color: #666666;
        line-height: 20px;
      }
      .recharge-item-footer {
        margin-top: 8px;
        font-size: 12px;
        color: #999999;
        line-height: 17px;
      }
    }
  }
}
</style>


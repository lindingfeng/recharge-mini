<template>
  <view class="recharge-traffic-list-component">
    <view v-if="list.length" class="recharge-traffic-title">*由于运营商限制，仅支持单次单笔支付</view>
    <scroll-view
      :scroll-y="true"
      class="recharge-traffic-list"
    >
      <view
        v-for="(item, index) in list"
        :key="index"
        class="recharge-traffic-item"
      >
        <view class="recharge-traffic-cell-group">
          <view class="recharge-traffic-cell">
            <text class="recharge-traffic-label">罚款名称：</text>
            <text class="recharge-traffic-value">{{ item.fine_name || '-' }}</text>
          </view>
          <view class="recharge-traffic-cell">
            <text class="recharge-traffic-label">罚款来源：</text>
            <text class="recharge-traffic-value">{{ item.fine_source || '-' }}</text>
          </view>
          <view class="recharge-traffic-cell">
            <text class="recharge-traffic-label">罚款时间：</text>
            <text class="recharge-traffic-value">{{ item.fine_time || '-' }}</text>
          </view>
          <view class="recharge-traffic-cell red">
            <text class="recharge-traffic-label">罚款金额：</text>
            <text class="recharge-traffic-value">{{ item.fine_amount }} {{ item.fine_amount_currency }} = {{ item.fine_amount_cny }}元</text>
          </view>
        </view>
        <view class="recharge-traffic-pay">
          <base-button
            class="recharge-traffic-list-button"
            @click="$emit('pay', item)"
          >
            支付
          </base-button>
        </view>
      </view>
    </scroll-view>
    <RechargePromptGroup
      v-if="list.length"
    >
      <RechargePromptCell>请勿重复支付！已缴纳罚单费用后，可能会出现【该罚单仍然存在】的现象，此为正常的延时滞后现象，请耐心稍作等待后再刷新。</RechargePromptCell>
    </RechargePromptGroup>
  </view>
</template>

<script>
export default {
  name: 'recharge-traffic-list'
}
</script>

<script setup>
import BaseButton from '@global/components/base-button'
import RechargePromptCell from '@/components/recharge-prompt-cell'
import RechargePromptGroup from '@/components/recharge-prompt-group'

defineProps({
  list: Array
})

defineEmits(['pay'])

</script>

<style lang="scss">
@import './index.scss';
</style>


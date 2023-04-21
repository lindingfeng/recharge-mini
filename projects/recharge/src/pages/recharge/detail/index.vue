<template>
  <view class="recharge-detail-page">
    <view class="recharge-detail-body">
      <view v-if="data.detailInfo.pay_order_id" class="recharge-detail-info">
        <view class="country-name">{{ data.detailInfo.top_up_name }}</view>
        <view class="recharge-order">
          <view class="recharge-order-cell">
            <view class="order-cell-body">
              <view class="cell-title">账号</view>
              <view class="cell-value">{{ data.detailInfo.account || '-' }}</view>
            </view>
            <view v-if="data.detailInfo.pin_code" class="order-cell-body">
              <view class="cell-title">PIN码</view>
              <view class="cell-value">{{ data.detailInfo.pin_code }}</view>
            </view>
            <view class="order-cell-body">
              <view class="cell-title bule">充值金额</view>
              <view class="cell-value bule">{{ data.detailInfo.product_amount }} {{ data.detailInfo.product_amount_currency }}</view>
            </view>
          </view>
          <view class="recharge-order-cell">
            <view class="order-cell-body">
              <view class="cell-title">支付状态</view>
              <view class="cell-value">{{ data.detailInfo.pay_status_for_humans || '-' }}</view>
            </view>
            <view class="order-cell-body">
              <view class="cell-title">充值状态</view>
              <view class="cell-value">{{ data.detailInfo.top_up_status_for_humans || '-' }}</view>
            </view>
          </view>
          <view class="recharge-order-cell">
            <view class="order-cell-body">
              <view class="cell-title red">应付金额</view>
              <view class="cell-value red">{{ data.detailInfo.pay_total_amount_for_humans || '0.00' }}元</view>
            </view>
            <view class="order-cell-body">
              <view class="cell-title green">实付金额</view>
              <view class="cell-value green">{{ data.detailInfo.pay_real_amount_for_humans || '0.00' }}元</view>
            </view>
          </view>
          <view class="recharge-order-cell">
            <view class="order-cell-body">
              <view class="cell-title">下单时间</view>
              <view class="cell-value">{{ data.detailInfo.created_at || '-' }}</view>
            </view>
            <view class="order-cell-body">
              <view class="cell-title">支付单号</view>
              <view class="cell-value">{{ data.detailInfo.pay_order_id || '-' }}</view>
            </view>
          </view>
        </view>
        <base-button
          v-if="data.detailInfo.is_allow_again === 1"
          class="recharge-button"
          @click="confirmRecharge"
        >
          再次充值
        </base-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import only from 'only'
import { reactive } from 'vue'
import BaseButton from '@global/components/base-button'
import Taro, { useLoad } from '@tarojs/taro'
import apis from '@global/apis/recharge'

const pageInstance = Taro.getCurrentInstance()

const data = reactive({
  detailInfo: {}
})

async function getRechargeDetail () {
  const [res] = await apis.getRechargeDetail({
    pay_order_id: pageInstance.router.params.id
  })
  if (res.status === 200) {
    data.detailInfo = res.data || {}
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取订单信息失败'
    })
  }
}

function confirmRecharge () {
  const settleQuery = []
  const rechargeParams = only(data.detailInfo, [
    'product_id',
    'service_id',
    'account_number',
    'pin_code',
    'calling_code',
    'product_amount',
    'product_amount_id',
    'top_up_ext_order_id',
  ].join(' '))
  Object.keys(rechargeParams).forEach(key => {
    if (rechargeParams[key]) {
      settleQuery.push(`${key}=${rechargeParams[key]}`)
    }
  })
  Taro.navigateTo({
    url: `/pages/cashier/index?${settleQuery.join('&')}`
  })
}

useLoad(() => {
  getRechargeDetail()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

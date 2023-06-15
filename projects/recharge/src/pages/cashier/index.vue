<template>
  <view class="cashier-page">
    <view class="cashier-header">
      <view class="cashier-money">
        <text class="money-tip">¥</text>
        <text class="money-text">{{ data.payInfo.product_amount_cny || 0 }}</text>
      </view>
      <view class="cashier-tip">{{ data.payInfo.service_name_zh }}</view>
    </view>
    <view class="cashier-footer">
      <view class="cashier-way-title">支付方式</view>
      <view class="cashier-ways">
        <view
          v-for="(item, index) in data.payWays"
          :key="index"
          class="cashier-way-item"
          @click="changePayWay(item)"
        >
          <image class="icon-recharge" :src="item.pay_mode_img" />
          <text class="cashier-name">{{ item.pay_mode_name }}</text>
          <image class="icon-select" :src="item.pay_mode === data.selectPay ? IconPaySel : IconPayNor" />
        </view>
      </view>
      <base-button
        v-if="data.payWays.length"
        :disabled="!data.selectPay"
        :loading="data.loading"
        @click="confirmRecharge"
      >
        确认充值
      </base-button>
    </view>
  </view>
</template>

<script setup>
import only from 'only'
import { reactive } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import BaseButton from '@global/components/base-button'
import { useGlobalStore } from '@global/common/store'
import { payment } from '@global/composables/common'
import apis from '@global/apis/recharge'
import { envMap } from '@global/config'

const IconPayNor = require('@/assets/imgs/common/icon_pay_nor.png')

const IconPaySel = require('@/assets/imgs/common/icon_pay_sel.png')

const pageInstance = Taro.getCurrentInstance()

const globalStore = useGlobalStore()

const { rechargePay } = payment()

const data = reactive({
  selectPay: '',
  payWays: [],
  payInfo: {},
  payParams: {},
  loading: false
})

/**
 * @function 获取支付产品信息
 */
 async function getPayDetail () {
  const [res] = await apis.getPayDetail({
    product_id: data.payParams.product_id,
    product_amount: data.payParams.product_amount
  })
  if (res.status === 200) {
    data.payInfo = res.data || {}
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取支付信息失败'
    })
  }
}

/**
 * @function 获取支付方式
 */
async function getPayWays () {
  const [res] = await apis.getPayWays()
  if (res.status === 200) {
    data.payWays = res.data || []
    if (data.payWays.length) {
      data.selectPay = data.payWays[0].pay_mode
    }
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取支付方式失败'
    })
  }
}

/**
 * @function 切换支付方式
 * @param {Object} item 目标支付方式信息
 */
 function changePayWay ({ pay_mode }) {
  if (data.selectPay === pay_mode) return
  data.selectPay = pay_mode
}

/**
 * @function 确认支付
 */
async function confirmRecharge () {
  data.loading = true
  const [res] = await apis.getPayParams({
    pay_mode: data.selectPay,
    device_type: envMap[globalStore.env].DEVICE_TYPE,
    ...only(data.payParams, [
      'product_id',
      'account_number',
      'calling_code',
      'service_id',
      'product_amount',
      'product_amount_id',
      'top_up_ext_order_id',
      'pin_code'
    ].join(' '))
  })
  if (res.status !== 200) {
    data.loading = false
    return Taro.showToast({
      icon: 'none',
      title: res.message || '获取支付信息失败'
    })
  }
  toPay(res.data)
}

/**
 * @function 开始支付
 * @param {Object} item 支付参数
 */
async function toPay (params) {
  const [res, err] = await rechargePay(params)
  data.loading = false
  if (res.code !== 200) {
    if (err.message) {
      Taro.showToast({
        icon: 'none',
        title: err.message
      })
    }
    return
  }
  Taro.redirectTo({
    url: '/pages/recharge/list/index'
  })
}

useLoad(() => {
  data.payParams = {
    ...pageInstance.router.params
  }
  getPayDetail()
  getPayWays()
})

</script>

<style lang="scss">
@import './index.scss';
</style>


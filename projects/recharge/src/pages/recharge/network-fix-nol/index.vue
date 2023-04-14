<template>
  <view class="recharge-network-fix-nol-page">
    <view class="recharge-network-fix-nol">
      <recharge-account-group>
        <recharge-account-cell
          v-model="data.account"
          title="账号"
          :placeholder="rechargePlaceholder"
        />
      </recharge-account-group>
      <recharge-operator-group
        v-model:active="data.operatorId"
        :disabled="data.productLoading"
        :loading="data.operatorLoading"
        :list="data.operatorList"
        @change="getAmountList"
      />
      <recharge-base-group
        v-if="amountList.length"
        title="充值金额"
      >
        <flow-amount-list
          v-model:active="data.rechargeIdx"
          :loading="data.productLoading"
          :list="amountList"
        />
        <template #recharge-base-footer>
          <base-button
            v-if="!rangeList.length && amountList.length"
            class="recharge-amount-button"
            :disabled="!allowRecharge"
            @click="confirmRecharge"
          >
            充值
          </base-button>
        </template>
      </recharge-base-group>
      <recharge-custom-group
        v-if="rangeList.length"
        v-model:input="data.rechargeValue"
        title="充值金额"
        :right-text="!data.account || isNol ? '' : '查询余额'"
        :input-attr="{
          type: 'digit',
          placeholder: `请输入金额（${rangeList[0].product_amount_currency}）`
        }"
        :recharge-tips="`金额范围：${rangeList[0].product_amount_min}-${rangeList[0].product_amount_max}，且必须为5的整数倍，否则充值失败。`"
        :button-attr="{
          disabled: !allowRecharge
        }"
        @title-right="getBalance"
        @recharge="confirmRecharge"
      />
      <recharge-prompt-group>
        <recharge-prompt-cell
          v-for="(value, index) in prompt.internet_credits"
          :key="index"
        >
          {{ index + 1 }}. {{ value }}
        </recharge-prompt-cell>
      </recharge-prompt-group>
    </view>
    <base-confirm
      v-model="data.rechargePopup"
      title="查询结果"
    >
      <template #body-content>
        <view class="recharge-account-content">
          <view class="recharge-account-title">账户余额为</view>
          <view class="recharge-account-money">{{ data.balanceInfo.balance }} {{ rangeList[0] ? rangeList[0].product_amount_currency : '' }}</view>
        </view>
      </template>
    </base-confirm>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { networkRecharge } from '@/composables/recharge'
import BaseButton from '@global/components/base-button'
import BaseConfirm from '@/components/base-confirm'
import FlowAmountList from '@/components/flow-amount-list'
import RechargeBaseGroup from '@/components/recharge-base-group'
import RechargePromptCell from '@/components/recharge-prompt-cell'
import RechargePromptGroup from '@/components/recharge-prompt-group'
import RechargeCustomGroup from '@/components/recharge-custom-group'
import RechargeAccountCell from '@/components/recharge-account-cell'
import RechargeAccountGroup from '@/components/recharge-account-group'
import RechargeOperatorGroup from '@/components/recharge-operator-group'
import { prompt } from '@/config'

const pageInstance = Taro.getCurrentInstance()

const query = pageInstance.router.params

const {
  data,
  allowRecharge,
  amountList,
  rangeList,
  getLatestOrder,
  getOperators,
  getProducts,
  queryBalance
} = networkRecharge()

// const isNetwork = computed(() => query.service_id === 'internet_credits')

// const isFix = computed(() => query.service_id === 'landline_credits')

const isNol = computed(() => query.service_id === 'nol_credits')

const rechargePlaceholder = computed(() => {
  const labelMap = {
    internet_credits: '请输入网络账号',
    landline_credits: '请输入固话账号',
    nol_credits: '请输入NOL卡账号'
  }
  return labelMap[query.service_id]
})

const navigationBarTitle = computed(() => {
  const labelMap = {
    internet_credits: '网络缴费',
    landline_credits: '固话缴费',
    nol_credits: 'NOL卡'
  }
  return labelMap[query.service_id]
})

async function getLatestOrderInfo () {
  const [res] = await getLatestOrder({
    country_iso3: query.iso3,
    service_id: query.service_id
  })

  if (res.status === 200) {
    data.account = res.data?.account_number || ''
  }
}

async function getOperatorList () {
  data.operatorLoading = true
  const [res] = await getOperators({
    service_id: query.service_id,
    country_iso3: query.iso3
  })
  data.operatorLoading = false
  if (res.status === 200) {
    data.operatorList = res.data || []
    if (!data.operatorId) {
      data.operatorId = data.operatorList[0]?.operator_id || ''
    }
    if (data.operatorId) {
      getAmountList({
        operator_id: data.operatorId
      })
    }
  }
}

async function getAmountList (item = {}) {
  data.productLoading = true
  const [res] = await getProducts({
    service_id: query.service_id,
    operator_id: item.operator_id
  })
  data.productLoading = false
  data.rechargeIdx = ''
  if (res.status === 200) {
    data.rechargeInfo = res.data || {}
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取充值产品失败'
    })
  }
}

async function getBalance () {
  if (!data.account) return
  Taro.showLoading({
    title: '查询中',
    mask: true
  })
  const [res] = await queryBalance({
    product_id: rangeList.value[0].product_id,
    account_number: data.account
  })
  Taro.hideLoading()
  if (res.status === 200) {
    data.balanceInfo = res.data || {}
    data.rechargePopup = true
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取信息失败'
    })
  }
}

function confirmRecharge () {
  let productId = ''
  let productAmount = ''
  if (data.rechargeValue) {
    if (
      Number(data.rechargeValue) < rangeList.value[0].product_amount_min ||
      Number(data.rechargeValue) > rangeList.value[0].product_amount_max ||
      Number(data.rechargeValue) % 5 !== 0
    ) {
      return Taro.showToast({
        icon: 'none',
        title: '请输入正确的充值金额'
      })
    }
    productId = rangeList.value[0].product_id
    productAmount = data.rechargeValue
  } else {
    productId = amountList.value[data.rechargeIdx].product_id
    productAmount = amountList.value[data.rechargeIdx].product_amount_min
  }
  const settleQuery = [
    `service_id=${query.service_id || ''}`,
    `product_id=${productId || ''}`,
    `product_amount=${productAmount || ''}`,
    `account_number=${data.account || ''}`
  ].join('&')
  Taro.navigateTo({
    url: `/pages/cashier/index?${settleQuery}`
  })
}

useLoad(() => {
  if (navigationBarTitle.value) {
    Taro.setNavigationBarTitle({
      title: navigationBarTitle.value
    })
  }
  getLatestOrderInfo()
  getOperatorList()
})

</script>

<style lang="scss">
@import './index.scss';
</style>
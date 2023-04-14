<template>
  <view class="recharge-flow-page">
    <view class="recharge-flow">
      <recharge-input-group
        v-model:input="data.phone"
        :operator-info="data.verifyInfo"
        :example-info="data.exampleInfo"
        @phone-pass="getAmountList"
        @phone-no-pass="removeFailureInfo"
        @operator="getOperatorList"
      />
      <recharge-base-group
        title="充值金额"
      >
        <flow-amount-list
          v-model:active="data.rechargeIdx"
          :disabled="!data.verifyInfo.is_valid"
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
        title="后付费自定义金额"
        :input-attr="{
          type: 'digit',
          readonly: !data.verifyInfo.is_valid,
          placeholder: `请输入金额（${rangeList[0].product_amount_currency}）`
        }"
        :recharge-tips="`金额范围：${rangeList[0].product_amount_min}-${rangeList[0].product_amount_max}，且必须为5的整数倍，否则充值失败。`"
        :button-attr="{
          disabled: !allowRecharge
        }"
        @recharge="confirmRecharge"
      />
      <recharge-prompt-group>
        <recharge-prompt-cell
          v-for="(value, index) in prompt.mobile_phone_data"
          :key="index"
        >
          {{ index + 1 }}. {{ value }}
        </recharge-prompt-cell>
      </recharge-prompt-group>
    </view>
    <base-action-sheet
      v-model="data.operatorActionSheet"
      :menu-items="data.operatorList"
      title="运营商列表"
      cancel-txt="取消"
      @choose="onSelectOperator"
    />
  </view>
</template>

<script setup>
import only from 'only'
import Taro, { useLoad } from '@tarojs/taro'
import { phoneRecharge } from '@/composables/recharge'
import BaseButton from '@global/components/base-button'
import FlowAmountList from '@/components/flow-amount-list'
import BaseActionSheet from '@global/components/base-action-sheet'
import RechargeCustomGroup from '@/components/recharge-custom-group'
import RechargePromptGroup from '@/components/recharge-prompt-group'
import RechargeInputGroup from '@/components/recharge-input-group'
import RechargePromptCell from '@/components/recharge-prompt-cell'
import RechargeBaseGroup from '@/components/recharge-base-group'
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
  getPhoneExample,
  checkAccount,
  getProducts,
  removeFailureInfo
} = phoneRecharge()

async function getExamples () {
  const [orderRes] = await getLatestOrder({
    country_iso3: query.iso3,
    service_id: query.service_id
  })

  if (orderRes.status === 200) {
    data.phone = orderRes.data?.account_number || ''
  }

  const [ExampleRes] = await getPhoneExample({
    country_iso3: query.iso3
  })

  if (!ExampleRes.status === 200 || !ExampleRes.data.phone_number) return

  data.exampleInfo = ExampleRes.data || {}
  
  const [checkRes] = await checkAccount({
    is_init: 1,
    country_iso2: query.iso2,
    phone_number: data.phone || ExampleRes.data.phone_number,
    service_id: query.service_id,
  })

  if (!checkRes.status === 200 || !checkRes.data.operator_id || !checkRes.data.is_valid) return

  getAmountList(checkRes.data, 'init')
}

async function getOperatorList () {
  if (data.operatorList.length) {
    data.operatorActionSheet = true
    return
  }
  Taro.showLoading({
    title: '加载中',
    mask: true
  })
  const [res] = await getOperators({
    service_id: query.service_id,
    country_iso3: query.iso3
  })
  Taro.hideLoading()
  if (res.status === 200) {
    const list = res.data || []
    list.filter(v => v.operator_name && v.operator_id).forEach(item => {
      item.name = item.operator_name
    });
    data.operatorList = list
    data.operatorActionSheet = true
  } else {
    Taro.showToast({
      icon: 'none',
      title: res.message || '获取信息失败'
    })
  }
}

function onSelectOperator (item) {
  Object.assign(data.verifyInfo, only(item, 'operator_id operator_name'))
  getAmountList(data.verifyInfo)
}

async function getAmountList (item = {}, type = 'action') {
  if (type !== 'init' || data.phone) {
    data.verifyInfo = item
  }
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
    `account_number=${data.phone || ''}`,
    `calling_code=${data.exampleInfo.calling_code || query.calling_code || ''}`,
  ].join('&')
  Taro.navigateTo({
    url: `/pages/cashier/index?${settleQuery}`
  })
}

useLoad(() => {
  getExamples()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

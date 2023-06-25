<template>
  <view class="recharge-card-page">
    <view class="recharge-card">
      <recharge-input-group
        v-model:input="data.phone"
        :show-operator-button="false"
        :operator-info="data.verifyInfo"
        :example-info="data.exampleInfo"
        @phone-pass="data.verifyInfo = $event"
        @phone-no-pass="removeFailureInfo"
      />
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
        <phone-amount-list
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
        title="充值金额"
        :input-attr="{
          type: 'digit',
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
          v-for="(value, index) in prompt.prepaid_card_credits"
          :key="index"
        >
          {{ index + 1 }}. {{ value }}
        </recharge-prompt-cell>
      </recharge-prompt-group>
    </view>
  </view>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { phoneRecharge } from '@/composables/recharge'
import BaseButton from '@global/components/base-button'
import PhoneAmountList from '@/components/phone-amount-list'
import RechargeBaseGroup from '@/components/recharge-base-group'
import RechargeInputGroup from '@/components/recharge-input-group'
import RechargePromptCell from '@/components/recharge-prompt-cell'
import RechargePromptGroup from '@/components/recharge-prompt-group'
import RechargeCustomGroup from '@/components/recharge-custom-group'
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
  getPhoneExample,
  checkAccount,
  getOperators,
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

  if (!ExampleRes.status === 200 || !ExampleRes.data?.phone_number) return

  data.exampleInfo = ExampleRes.data || {}

  if (!data.phone) return

  const [checkRes] = await checkAccount({
    is_init: 1,
    country_iso2: query.iso2,
    phone_number: data.phone,
    service_id: query.service_id,
  })

  if (checkRes.status === 200) {
    data.verifyInfo = checkRes.data || {}
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
      getAmountList({ operator_id: data.operatorId })
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
  getOperatorList()
})

</script>

<style lang="scss">
@import './index.scss';
</style>


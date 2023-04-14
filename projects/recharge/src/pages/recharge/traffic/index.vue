<template>
  <view class="recharge-traffic-page">
    <view class="recharge-traffic">
      <recharge-base-group
        title="车辆信息"
        class="recharge-base-traffic"
      >
        <recharge-traffic-cell
          title="车辆属地"
          readonly
          v-model="data.traffic.possession.name"
          :show-right-icon="true"
          placeholder="请选择车辆属地"
          @click="showActionSheet('possession')"
        />
        <recharge-traffic-cell
          title="车辆类型"
          readonly
          v-model="data.traffic.type.name"
          :show-right-icon="true"
          placeholder="请选择车辆类型"
          @click="showActionSheet('type')"
        />
        <recharge-traffic-cell
          title="车牌编号"
          readonly
          v-model="data.traffic.license.name"
          :show-right-icon="true"
          placeholder="请选择车牌编号"
          @click="showActionSheet('license')"
        />
        <recharge-traffic-cell
          v-model="data.traffic.number"
          title="车牌号码"
          placeholder="请输入车牌编号"
        />
        <template #recharge-base-footer>
          <base-button
            class="recharge-traffic-button"
            :disabled="!allowRecharge"
            :loading="data.loading"
            @click="queryTraffic"
          >
            查询
          </base-button>
        </template>
      </recharge-base-group>
      <recharge-prompt-group>
        <recharge-prompt-cell>1. 由于运营商限制，相同运营商且相同金额的充值，需间隔10分钟以上才能再次充值；</recharge-prompt-cell>
        <recharge-prompt-cell>2. 先请确认运营商和号码是否匹配且正确,再选择适合的金额支付充值，充值成功不可更改和退款；</recharge-prompt-cell>
        <recharge-prompt-cell>3. 充值过程遇到问题，请及时联系客服；</recharge-prompt-cell>
      </recharge-prompt-group>
    </view>
    <base-action-sheet
      v-model="data.actionSheetStatus"
      :menu-items="data.actions"
      title="选项列表"
      cancel-txt="取消"
      @choose="onSelect"
    />
    <base-confirm
      v-model="data.rechargePopup"
      title="罚单列表"
      confirm-text="关闭"
      :show-confirm="!hasTrafficFine"
    >
      <template #body>
        <view class="recharge-traffic-content">
          <recharge-traffic-list
            :list="data.trafficList"
            @pay="payTrafficFine"
          />
          <view v-if="!hasTrafficFine" class="no-traffic">
            <image class="icon-link" src="@/assets/imgs/common/icon_like.png" />
            <view class="link-desc">很好！您目前没有任何罚单</view>
          </view>
        </view>
      </template>
    </base-confirm>
  </view>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useCommonStore } from '@/store/common'
import Taro, { useLoad, useUnload } from '@tarojs/taro'
import BaseConfirm from '@/components/base-confirm'
import BaseButton from '@global/components/base-button'
import RechargeBaseGroup from '@/components/recharge-base-group'
import BaseActionSheet from '@global/components/base-action-sheet'
import RechargePromptCell from '@/components/recharge-prompt-cell'
import RechargePromptGroup from '@/components/recharge-prompt-group'
import RechargeTrafficList from '@/components/recharge-traffic-list'
import RechargeTrafficCell from '@/components/recharge-traffic-cell'
import apis from '@global/apis/recharge'

const pageInstance = Taro.getCurrentInstance()

const query = pageInstance.router.params

const commonStore = useCommonStore()

const data = reactive({
  traffic: {
    possession: {},
    type: {},
    license: {},
    number: ''
  },
  actions: [],
  trafficList: [],
  loading: false,
  rechargePopup: false,
  actionSheetStatus: false
})

const allowRecharge = computed(() => {
  const { possession, type, license, number } = data.traffic
  return possession.name && type.name && license.name && number
})

const hasTrafficFine = computed(() => data.trafficList.length > 0)

function showActionSheet (type) {
  switch (type) {
    case 'possession':
      data.actions = commonStore.carSources
      break;
    case 'type':
      data.actions = commonStore.carCategories
      break;
    case 'license':
      data.actions = commonStore.carCodes
      break;
  }
  data.actionSheetStatus = true
}

function onSelect (item, targetCode = '') {
  data.traffic[item.type] = item
  if (item.type === 'possession') {
    data.traffic.license = {}
    commonStore.getCarCodes({
      source: item.name_en
    }, list => {
      if (!targetCode) return
      data.traffic.license = list.find(e => e.name === targetCode) || {}
    })
  }
}

async function queryTraffic () {
  data.loading = true
  const account = [
    data.traffic.possession.name_en,
    data.traffic.type.name_en,
    data.traffic.license.name,
    data.traffic.number
  ].join('/')
  const [res] = await apis.getFines({ account })
  data.loading = false
  if (res.status === 200) {
    data.trafficList = res.data || []
    data.rechargePopup = true
  } else {
    Taro.showToast({
        icon: 'none',
        title: res.message || '获取罚单信息失败'
      })
  }
}

async function payTrafficFine (item) {
  data.rechargePopup = false
  const account = [
    data.traffic.possession.name_en,
    data.traffic.type.name_en,
    data.traffic.license.name,
    data.traffic.number
  ].join('/')
  const settleQuery = [
    `product_id=dubai-police-plate-no`,
    `service_id=${query.service_id || ''}`,
    `account_number=${account || ''}`,
    `product_amount=${item.fine_amount || ''}`,
    `product_amount_id=${item.fine_amount_id || ''}`,
    `top_up_ext_order_id=${item.transaction_id || ''}`,
  ].join('&')
  Taro.navigateTo({
    url: `/pages/cashier/index?${settleQuery}`
  })
}

useUnload(() => {
  if (commonStore.carCodes.length) {
    commonStore.carCodes = []
  }
})

useLoad(async () => {
  const [res] = await apis.getLatestOrder({
    country_iso3: query.iso3,
    service_id: query.service_id
  })

  const accounts = (res.data?.account_number || '').split('/')

  if (accounts.length === 4) {
    data.traffic.number = accounts[3]
  }

  commonStore.getCarSources(carSources => {
    if (carSources.length) {
      onSelect(carSources.find(v => v.name_en === accounts[0]) || carSources[0], accounts[2] || '')
    }
  })
  commonStore.getCarCategories(carCategories => {
    if (carCategories.length) {
      onSelect(carCategories.find(v => v.name_en === accounts[1]) || carCategories[0])
    }
  })
})

</script>

<style lang="scss">
@import './index.scss';
</style>


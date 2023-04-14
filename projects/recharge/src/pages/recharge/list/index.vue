<template>
  <view class="recharge-list-page">
    <base-list
      v-model:error="statusInfo.error"
      :loading="statusInfo.dataLoading"
      :finished="statusInfo.finished"
      :no-data="statusInfo.noData"
      class="custom-recharge-list"
      @refresh="loadMore"
    >
      <view class="recharge-list">
        <recharge-list
          :list="list"
          @detail="Taro.navigateTo({
            url: `/pages/recharge/detail/index?id=${$event.pay_order_id}`
          })"
        />
      </view>
    </base-list>
  </view>
</template>

<script setup>
import BaseList from '@global/components/base-list'
import RechargeList from '@/components/recharge-list'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import infinite from '@global/composables/infinite'
import apis from '@global/apis/recharge'

/**
 * @function 分页 Composables Api
 * @param {Object} field
 */
 const {
  list,
  statusInfo,
  loadMore,
  // pullRefresh,
  restartData
} = infinite({
  interfaceApi: apis,
  interfaceName: 'getRechargeList'
})

useReachBottom(() => {
  if (
    statusInfo.dataLoading ||
    statusInfo.noData ||
    statusInfo.finished ||
    statusInfo.error
  ) return
  loadMore()
})

useLoad(() => {
  restartData()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

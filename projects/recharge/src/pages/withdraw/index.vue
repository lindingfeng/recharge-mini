<template>
  <view class="withdraw-list-page">
    <view class="withdraw-body">
      <withdraw-list
        :list="list"
      />
      <finished-placeholder
        v-if="loaded"
        :noData="noData"
        :class="{
          'no-data-placeholder': noData
        }"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLoad } from '@tarojs/taro'
import WithdrawList from '@/components/withdraw-list'
import FinishedPlaceholder from '@global/components/finished-placeholder'
import apis from '@global/apis/recharge'

const list = ref([])

const loaded = ref(false)

const noData = computed(() => list.value.length === 0)

async function getWithdrawList () {
  const [res] = await apis.getWithdrawList()
  if (res.status === 200) {
    list.value = res.data || []
    // list.value = [{
    //   "amount_statement_name": "提现",
    //   "created_at": "2022-12-26 09:57:36",
    //   "amount_for_humans": "100.00",
    //   "status_for_humans": "等待"
    // },
    // {
    //   "amount_statement_name": "提现",
    //   "created_at": "2022-12-26 09:57:35",
    //   "amount_for_humans": "100.00",
    //   "status_for_humans": "等待"
    // },
    // {
    //   "amount_statement_name": "提现",
    //   "created_at": "2022-12-26 09:57:35",
    //   "amount_for_humans": "100.00",
    //   "status_for_humans": "等待"
    // }]
  }
  loaded.value = true
}

useLoad(() => {
  getWithdrawList()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

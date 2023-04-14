<template>
  <view class="earnings-list-page">
    <view class="earnings-body">
      <earnings-list
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
import EarningsList from '@/components/earnings-list'
import FinishedPlaceholder from '@global/components/finished-placeholder'
import apis from '@global/apis/recharge'

const list = ref([])

const loaded = ref(false)

const noData = computed(() => list.value.length === 0)

async function getEarningsList () {
  const [res] = await apis.getEarningsList()
  if (res.status === 200) {
    // list.value = res.data || []
    list.value = [{
      "amount_statement_name": "推广返利",
      "created_at": "2022-12-26 09:32:03",
      "amount_for_humans": "200.00",
      "balance_for_humans": "300.00"
    },
    {
      "amount_statement_name": "推广返利",
      "created_at": "2022-12-26 01:28:31",
      "amount_for_humans": "100.00",
      "balance_for_humans": "100.00"
    }]
  }
  loaded.value = true
}

useLoad(() => {
  getEarningsList()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

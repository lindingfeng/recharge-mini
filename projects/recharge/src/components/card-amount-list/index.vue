<template>
  <view class="card-amount-list-component" :class="{ disabled }">
    <view v-if="loading" class="amount-placeholder">
      <view class="amount-loading">
        <Loading size="24px" color="#c9c9c9" />
      </view>
    </view>
    <view v-else-if="list.length" class="card-amount-list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="recharge-amount-item max"
        :class="{
          active: index === selectIdx
        }"
        @click="selectAmount(index)"
      >
        <view class="recharge-amount-title">
          <text class="title-label">{{ item.product_description_zh }}</text>
        </view>
        <view class="recharge-amount-child">
          <view class="recharge-amount-num">{{ item.product_amount_currency }} {{ item.product_amount_min }}</view>
          <view class="recharge-amount-label">¥ {{ item.product_amount_min_cny }}</view>
        </view>
        <image
          v-show="index === selectIdx"
          class="icon-amount-select"
          src="@/assets/imgs/common/icon_recharge_sel.png"
        />
      </view>
    </view>
    <view v-else class="amount-placeholder">
      <view class="amount-null">
        <view class="no-data">
          <image class="icon-no-data" src="@/assets/imgs/common/icon_nodata.png" />
          <view class="no-data-text">暂无产品</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'card-amount-list'
}
</script>

<script setup>
import { Loading } from '@nutui/icons-vue-taro'
import { computed } from 'vue'

const props = defineProps({
  active: [Number, String],
  list: Array,
  disabled: Boolean,
  loading: Boolean
})

const emits = defineEmits([
  'update:active'
])

const selectIdx = computed({
  get () {
    return props.active
  },
  set (value) {
    emits('update:active', value)
  }
})

function selectAmount (index) {
  if (props.disabled) return
  let idx = index
  if (selectIdx.value === index) {
    idx = ''
  }
  selectIdx.value = idx
}

</script>

<style lang="scss">
@import '@/assets/style/components/amount-list.scss';
</style>


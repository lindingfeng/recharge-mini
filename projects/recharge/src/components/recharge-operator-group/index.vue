<template>
  <view class="recharge-operator-group-component">
    <base-header title="运营商" />
    <view class="recharge-operator-body">
      <view v-if="loading" class="recharge-operator-loading">
        <Loading size="24px" color="#c9c9c9" />
      </view>
      <view v-else-if="list.length" class="recharge-operator-list">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="recharge-operator-item"
          :class="{
            most: list.length > 1 && list.length < 4,
            active: item.operator_id === selectId
          }"
          @click="selectOperator(item)"
        >
          <view class="recharge-operator-child">
            <view class="recharge-operator-top">
              <image
                class="icon-operator"
                mode="widthFix"
                :src="item.operator_icon_url"
              />
              <image
                v-show="item.operator_id === selectId"
                class="icon-amount-select"
                src="@/assets/imgs/common/icon_recharge_sel.png"
              />
            </view>
            <view class="recharge-operator-bottom">
              <text class="recharge-operator-name">{{ item.operator_name }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="recharge-operator-no-data">
        <view class="no-data">
          <image class="icon-no-data" src="@/assets/imgs/common/icon_nodata.png" />
          <view class="no-data-text">暂无运营商</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'recharge-operator-group'
}
</script>

<script setup>
import { computed } from 'vue'
import { Loading } from '@nutui/icons-vue-taro'
import BaseHeader from '@/components/base-header'

const props = defineProps({
  active: [Number, String],
  list: Array,
  disabled: Boolean,
  loading: Boolean
})

const emits = defineEmits([
  'update:active',
  'change'
])

const selectId = computed({
  get () {
    return props.active
  },
  set (value) {
    emits('update:active', value)
  }
})

function selectOperator (item) {
  if (props.disabled || selectId.value === item.operator_id) return
  selectId.value = item.operator_id
  emits('change', item)
}

</script>

<style lang="scss">
@import './index.scss';
</style>


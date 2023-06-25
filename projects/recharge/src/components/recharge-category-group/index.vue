<template>
  <view class="recharge-category-group-component">
    <view v-if="loading" class="recharge-category-loading">
      <Loading size="24px" color="#c9c9c9" />
    </view>
    <view v-else-if="list.length" class="recharge-category-group">
      <view
        v-for="item in list"
        :key="item.service_id"
        class="recharge-item"
        @click="$emit('category', item)"
      >
        <view class="recharge-item-content">
          <view class="recharge-image">
            <image class="icon-recharge" :src="item.service_icon_url" />
          </view>
          <view class="recharge-name">{{ item.service_name_zh }}</view>
        </view>
      </view>
    </view>
    <view v-else class="recharge-category-no-data">
      <view class="no-data">
        <image class="icon-no-data" src="@/assets/imgs/common/icon_nodata.png" />
        <view class="no-data-text">暂无服务</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'recharge-category-group'
}
</script>

<script setup>
import { Loading } from '@nutui/icons-vue-taro'

defineProps({
  list: Array,
  loading: Boolean
})

defineEmits(['category'])

</script>

<style lang="scss">
@import './index.scss';
</style>


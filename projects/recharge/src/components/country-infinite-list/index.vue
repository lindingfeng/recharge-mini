<template>
  <view class="country-infinite-list-component">
    <scroll-view
      :scroll-y="true"
      class="scroll-view-list"
      @scrolltolower="loadMore"
    >
      <view class="scroll-view-body">
        <country-list
          v-if="data.list.length"
          :list="data.list"
          @country="$emit('country', $event)"
        />
        <finished-placeholder
          v-if="status.finished"
          :noData="noData"
          :class="{
            'no-data-placeholder': noData
          }"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'country-infinite-list'
}
</script>

<script setup>
import Taro from '@tarojs/taro'
import { reactive, computed, onMounted } from 'vue'
import CountryList from '@/components/country-list'
import FinishedPlaceholder from '@global/components/finished-placeholder'

const props = defineProps({
  list: Array
})

defineEmits(['country'])

const status = reactive({
  loading: false,
  finished: false
})

const data = reactive({
  list: [],
  pageInfo: {
    pageIndex: 1,
    pageSize: 20
  }
})

const noData = computed(() => props.list.length === 0)

async function loadMore () {
  if (!props.list.length || status.finished) {
    if (!status.finished) {
      status.finished = true
    }
    return
  }
  const isMore = data.list.length > 0
  const pageIndex = isMore ? data.pageInfo.pageIndex + 1 : data.pageInfo.pageIndex
  const startIndex = isMore ? (pageIndex - 1) * data.pageInfo.pageSize : pageIndex - 1
  const endIndex = startIndex + data.pageInfo.pageSize
  const nextData = props.list.filter((item, index) => {
    return index >= startIndex && index < endIndex
  })
  data.list = isMore ? data.list.concat(nextData) : nextData
  data.pageInfo.pageIndex = pageIndex
  if (data.list.length >= props.list.length) {
    status.finished = true
  }
  Taro.nextTick(() => {
    status.loading = false
  })
}

onMounted(() => {
  loadMore()
})

</script>

<style lang="scss">
@import './index.scss';
</style>


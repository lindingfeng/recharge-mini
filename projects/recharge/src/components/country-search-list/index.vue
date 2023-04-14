<template>
  <view class="country-search-list-component">
    <scroll-view
      :scroll-y="true"
      class="scroll-view-list"
    >
    <view class="scroll-view-body">
      <country-list
        :list="countryLists"
        @country="$emit('country', $event)"
      />
      <finished-placeholder
        v-if="!littleData"
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
  name: 'country-search-list'
}
</script>

<script setup>
import { computed } from 'vue'
import CountryList from '@/components/country-list'
import FinishedPlaceholder from '@global/components/finished-placeholder'

const props = defineProps({
  value: String,
  list: Array
})

defineEmits(['country'])

const littleData = computed(() => countryLists.value.length > 0 && countryLists.value.length < 8)

const noData = computed(() => countryLists.value.length === 0)

const countryLists = computed(() => {
  return props.list.filter(country => country.name_zh.indexOf(props.value) > -1)
})

</script>

<style lang="scss">
@import './index.scss';
</style>


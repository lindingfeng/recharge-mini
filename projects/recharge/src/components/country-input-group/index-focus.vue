<template>
  <view class="country-input-group-component">
    <view class="country-input-group">
      <view
        v-if="baseCommonStore.selectCountry.name_zh"
        class="select-country-body"
        @click="searchCountry"
      >
        <image
          class="select-country-image"
          :src="baseCommonStore.selectCountry.icon_url"
        />
        <view class="select-country-name">{{ baseCommonStore.selectCountry.name_zh }}</view>
        <view @click.stop="removeSelectCountry">
          <image
            class="close-image"
            src="@/assets/imgs/common/icon_close.png"
          />
        </view>
      </view>
      <view class="input-body">
        <nut-input
          v-model="inputs"
          placeholder-style="color: #666666"
          :focus="data.isFocus"
          :placeholder="baseCommonStore.selectCountry.name_zh ? '' : '支持选择或搜索国家/地区'"
          @focus="focusHandler"
          @blur="data.isFocus = false"
        />
        <!-- <input
          :value="inputs"
          placeholder-style="color: #666666"
          :focus="data.isFocus"
          :placeholder="baseCommonStore.selectCountry.name_zh ? '' : '支持选择或搜索国家/地区'"
          @focus="focusHandler"
          @blur="data.isFocus = false"
          @input="inputs = $event.detail.value"
        /> -->
      </view>
      <view class="down-image">
        <image class="icon-down" src="@/assets/imgs/common/icon_down.png" />
      </view>
    </view>
    <view v-if="data.countryVisible" class="country-list-body">
      <country-search-list
        v-if="inputs"
        :value="inputs"
        :list="baseCommonStore.countryList"
        @country="selectCountry"
      />
      <country-infinite-list
        v-else
        :list="baseCommonStore.countryList"
        @country="selectCountry"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: 'country-input-group'
}
</script>

<script setup>
import Taro from '@tarojs/taro'
import { ref, reactive } from 'vue'
import { useCommonStore } from '@/store/common'
import CountrySearchList from '@/components/country-search-list'
import CountryInfiniteList from '@/components/country-infinite-list'

const baseCommonStore = useCommonStore()

defineProps({
  list: Array
})

const inputs = ref('')

const data = reactive({
  isFocus: false,
  countryVisible: false
})

function focusHandler () {
  data.isFocus = true
  data.countryVisible = true
}

function removeSelectCountry () {
  baseCommonStore.selectCountry = {}
  Taro.removeStorageSync('select_country')
  searchCountry(true)
}

function searchCountry (auto = false) {
  if (data.countryVisible || !auto) {
    data.isFocus = false
    data.countryVisible = false
  } else {
    data.isFocus = true
  }
}

function selectCountry (item) {
  const selectCountry =  item || {}
  baseCommonStore.selectCountry = selectCountry
  data.countryVisible = false
  data.isFocus = false
  inputs.value = ''
  Taro.setStorageSync('select_country', selectCountry)
  baseCommonStore.getServices()
}

</script>

<style lang="scss">
@import './index.scss';
</style>


<template>
  <view class="country-list-component">
    <view
      class="country-list"
      @click="selectCountry"
    >
      <view
        v-for="(item, index) in list"
        :key="item.iso3"
        class="country-item"
      >
        <image
          :src="item.icon_url"
          class="country-image"
        />
        <text class="country-name">{{ item.name_zh }}</text>
        <view class="country-item-mask" :data-index="index"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'country-list'
}
</script>

<script setup>

const props = defineProps({
  list: Array
})

const emits = defineEmits(['country'])

function selectCountry (e) {
  const countryInfo = props.list[e.target.dataset.index] || {}
  emits('country', countryInfo)
}

</script>

<style lang="scss">
@import './index.scss';
</style>


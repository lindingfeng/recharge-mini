<template>
  <view class="country-list-component">
    <view class="country-list">
      <view
        v-for="item in list"
        :key="item.iso3"
        class="country-item"
        @click="selectCountry(item)"
      >
        <image
          :src="item.icon_url"
          class="country-image"
        />
        <text class="country-name">{{ item.name_zh }}</text>
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

function selectCountry (item) {
  emits('country', item)
}

</script>

<style lang="scss">
@import './index.scss';
</style>


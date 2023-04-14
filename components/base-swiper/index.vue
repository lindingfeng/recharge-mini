<template>
  <view class="base-swiper-component">
    <view
      class="base-swiper-body"
      :style="{
        height,
        borderRadius: radius
      }"
    >
      <view v-if="list.length > 1" class="base-swiper-content">
        <swiper
          :autoplay="true"
          :circular="true"
          :interval="3000"
          :indicatorDots="false"
          v-bind="$attrs"
          @change="swiperChange"
        >
          <swiper-item
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="banner-image-body" @click="$emit('click', item)">
              <image :mode="imageMode" :src="item.img_url" class="banner-image" />
            </view>
          </swiper-item>
        </swiper>
        <view class="custom-swiper-indicator-dots">
          <view class="indicator-dots-list">
            <view
              v-for="num in list.length"
              :key="num"
              :name="num"
              class="indicator-dots-item"
              :class="{
                active: num === active + 1
              }"
            />
          </view>
        </view>
      </view>
      <view v-else class="one-banner" @click="$emit('click', list[0])">
        <image :mode="imageMode" :src="list[0].img_url" class="banner-image" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'base-swiper'
}
</script>

<script setup>
import { ref } from 'vue'

defineProps({
  list: Array,
  imageMode: {
    type: String,
    default: 'aspectFill'
  },
  height: {
    type: String,
    default: '150px'
  },
  radius: {
    type: String,
    default: '0px'
  }
})

defineEmits(['click'])

const active = ref(0)

function swiperChange (e) {
  active.value = e.detail.current
}

</script>

<style lang="scss">
.base-swiper-component {
  .base-swiper-body {
    position: relative;
    height: 100%;
    transform: translateZ(0);
    overflow: hidden;
    .base-swiper-content, .one-banner {
      height: 100%;
    }
  }
  .banner-image-body, .banner-image {
    width: 100%;
    height: 100%;
  }
  .custom-swiper-indicator-dots {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    .indicator-dots-list {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      .indicator-dots-item {
        width: 8px;
        height: 3px;
        margin: 0 2px;
        background: rgba(0, 0, 0, .3);
        border-radius: 2px;
        &.active {
          background: #218cff;
        }
      }
    }
  }
}
</style>
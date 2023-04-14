<template>
  <view class="base-navigator-bar-component">
    <view
      class="base-navigator-placeholder"
      :style="{
        height: navigatorBarHeight + 'px'
      }"
    />
    <view
      class="base-navigator-bar"
      :style="{
        height: navigatorBarHeight + 'px'
      }"
    >
      <view
        class="base-navigator-content"
        :style="{
          paddingLeft: menuButtonRightMgr + 'px',
          paddingRight: menuButtonRightMgr + 'px',
          paddingBottom: bottomPadding + 'px'
        }"
      >
        <view
          class="base-navigator-header"
          :style="{
            height: menuButtonHeight + 'px'
          }"
        >
          <view class="navigator-back" @click="navigatorBack">
            <image v-if="theme === 'dark'" class="icon-back" src="@/assets/imgs/common/icon_dark_back.png" />
            <image v-else class="icon-back" src="@/assets/imgs/common/icon_light_back.png" />
          </view>
          <view class="navigator-title" :class="[theme]">{{ title }}</view>
          <view class="navigator-placeholder"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'base-navigator-bar'
}
</script>

<script setup>
import Taro from '@tarojs/taro'
import { computed, onMounted } from 'vue'
import { useGlobalStore } from '@global/common/store'

const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  },
  title: {
    type: String,
    default: '标题'
  },
  customBack: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['back'])

const globalStore = useGlobalStore()

const bottomPadding = 6

const navigatorBarHeight = computed(() => {
  return (globalStore.rectInfo.top || 0) + (globalStore.rectInfo.height || 0) + bottomPadding
})

const menuButtonHeight = computed(() => {
  return globalStore.rectInfo.height || 0
})

const menuButtonRightMgr = computed(() => {
  return (globalStore.systemInfo.windowWidth || 0) - (globalStore.rectInfo.right || 0)
})

function navigatorBack () {
  if (props.customBack) {
    return emits('back')
  }
  Taro.navigateBack()
}

onMounted(() => {
  console.log(globalStore.rectInfo, globalStore.systemInfo)
})

</script>

<style lang="scss">
.base-navigator-bar-component {
  .base-navigator-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    .base-navigator-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      box-sizing: border-box;
      .base-navigator-header {
        display: flex;
        align-items: center;
        justify-content: center;
        .navigator-back {
          width: 24px;
          height: 24px;
          .icon-back {
            width: 100%;
            height: 100%;
          }
        }
        .navigator-title {
          flex: 1;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          &.dark {
            color: #ffffff;
          }
        }
        .navigator-placeholder {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
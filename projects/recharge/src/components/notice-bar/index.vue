<template>
  <view class="notice-bar-component">
    <view
      :style="{ background }"
      class="notice-bar-content"
    >
      <view class="message-notice-image">
        <image class="icon-message-notice" src="@/assets/imgs/common/icon_message_notice.png" />
      </view>
      <view
        :id="data.textId"
        :style="{ color }"
        class="message-notice-text"
      >
        <view
          :id="data.txtId"
          :style="animationStyle"
          :class="[data.animationClass]"
          class="message-notice-txt"
          @animationend="animationend"
        >
          {{ text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'notice-bar'
}
</script>

<script setup>
import Taro from '@tarojs/taro'
import { reactive, computed, watch, onMounted } from 'vue'

// 组件时间戳
const timestamp = new Date().getTime()

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#218CFF'
  },
  background: {
    type: String,
    default: 'rgba(255, 255, 255, 0.6)'
  },
  speed: {
    type: [Number, String],
    default: 60
  }
})

const data = reactive({
  textId: 'message-text-' + timestamp,
  txtId: 'message-txt-' + timestamp,
  animationClass: '',
  textNodeWidth: 0,
  txtNodeWidth: 0,
  text: props.text
})

const animationStyle = computed(() => {
  return data.animationClass === 'play-infinite'
    ?
    {
      animationDuration: (data.textNodeWidth + data.txtNodeWidth) / props.speed + 's',
      transform: `translateX(${data.textNodeWidth + 'px'})`
    }
    :
    {
      animationDuration: data.txtNodeWidth / props.speed + 's'
    }
})

watch(() => props.text, (value) => {
  if (data.text === value) return
  data.animationClass = ''
  data.text = value
  findNodeData()
})

function findNodeData () {
  setTimeout(() => {
    const query = Taro.createSelectorQuery()
    const selectText = data.textNodeWidth > 0 ? `#${data.txtId}` : `#${data.textId}, #${data.txtId}`
    query.selectAll(selectText)
    .fields({
      node: true,
      size: true
    })
    .exec(res => {
      const [nodes = []] = res
      if (!nodes.length || nodes.length === 0) {
        return findNodeData()
      }
      if (nodes.length > 1) {
        data.textNodeWidth = nodes[0]?.width || 0
        data.txtNodeWidth = nodes[1]?.width || 0
      } else {
        data.txtNodeWidth = nodes[0]?.width || 0
      }
      if (data.text && data.txtNodeWidth > data.textNodeWidth) {
        data.animationClass = 'play'
      }
    })
  }, 100);
}

function animationend () {
  if (data.animationClass = 'play') {
    data.animationClass = 'play-infinite'
  }
}

onMounted(() => {
  findNodeData()
})

</script>

<style lang="scss">
.notice-bar-component {
  .notice-bar-content {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 30px;
  }
  .message-notice-image {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    .icon-message-notice {
      width: 100%;
      height: 100%;
    }
  }
  .message-notice-text {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    font-size: 12px;
    overflow: hidden;
    .message-notice-txt {
      white-space: nowrap;
      &.play {
        animation-name: play;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }
      &.play-infinite {
        animation-name: playInfinite;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    }
  }
}
@keyframes play {
  to {
    transform: translateX(-100%);
  }
}
@keyframes playInfinite {
  to {
    transform: translateX(-100%);
  }
}
</style>
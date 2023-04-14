<template>
  <view class="contact-page">
    <view class="contact-body">
      <image
        class="contact-bg"
        mode="widthFix"
        src="@/assets/imgs/common/icon_contact_bg.png"
      />
      <view class="contact-body-child">
        <view class="contact-header">
          <image class="icon-logo" src="@/assets/imgs/common/icon_contact_logo.png" />
          <text class="contact-name">全酋付客服</text>
        </view>
        <view class="contact-qrcode">
          <view
            class="custom-qrcode"
            @longtap="saveImageToPhotosAlbum(baseCommonStore.contactUrl)"
            @longpress="saveImageToPhotosAlbum(baseCommonStore.contactUrl)"
          >
            <image
              v-if="baseCommonStore.contactUrl"
              class="icon-qrcode"
              :src="baseCommonStore.contactUrl"
            />
          </view>
        </view>
        <view class="contact-footer">扫一扫上面的二维码图案，加我微信</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useDidShow } from '@tarojs/taro'
import { TaroAsync } from '@global/common/taro'
import { useCommonStore } from '@/store/common'
import { saveFile } from '@global/composables/common'
import { useGlobalStore } from '@global/common/store'

const globalStore = useGlobalStore()

const baseCommonStore = useCommonStore()

const { saveImage } = saveFile()

async function saveImageToPhotosAlbum (image) {
  if (!image || !['weapp', 'alipay'].includes(globalStore.env)) return
  const [res] = await TaroAsync(Taro.showModal, {
    title: '提示',
    content: '是否将图片保存至相册？',
    confirmText: '确认',
    confirmColor: '#218CFF'
  })
  if (res.confirm) {
    saveImage(image)
  }
}

useDidShow(() => {
  if (baseCommonStore.contactUrl) return
  baseCommonStore.getConTactQrcode()
})

</script>

<style lang="scss">
@import './index.scss';
</style>

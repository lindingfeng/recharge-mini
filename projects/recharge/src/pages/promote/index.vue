<template>
  <view class="promotion-page">
    <view class="promotion-body">
      <view class="my-promotion">
        <view class="promotion-title">我的「全酋付」推广二维码</view>
        <view class="promotion-qrcode-content">
          <view class="promotion-qrcode">
            <view
              class="custom-qrcode"
              @longtap="saveImageToPhotosAlbum(data.promotionInfo.qrcode)"
              @longpress="saveImageToPhotosAlbum(data.promotionInfo.qrcode)"
            >
              <image
                v-if="data.promotionInfo.qrcode"
                class="icon-qrcode"
                :src="data.promotionInfo.qrcode"
              />
            </view>
          </view>
          <view class="promotion-tips">推广可得充值金额0.5%的收益</view>
          <view class="promotion-save">长按图片可保存</view>
        </view>
      </view>
      <view class="promotion-detail">
        <view class="detail-content">
          <view class="detail-title">
            <view class="title-name">推广收益</view>
            <view class="record-name" @click="Taro.navigateTo({ url: '/pages/earnings/index' })">收益记录</view>
            <view class="line"></view>
            <view class="withdraw-name" @click="data.withdrawPopup = true">提现</view>
          </view>
          <view class="detail-assets">
            <view class="assets-title">收益金额（人民币）</view>
            <view
              class="eye-content"
              @click="desensitization = !desensitization"
            >
              <image
                class="icon-eye"
                :src="desensitization ? iconEyeClose : iconEyeOpen"
              />
            </view>
          </view>
          <view class="assets-money">{{ desensitization ? '******' : `¥ ${data.promotionInfo.money}` }}</view>
          <view class="withdraw-tips">
            <view class="tips-content">
              <image class="icon-tips" src="@/assets/imgs/common/icon_withdraw_tip.png" />
              <text>单次提现金额须在100元以上</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <base-confirm
      v-model="data.withdrawPopup"
      title="提现"
      confirm-text="确定提现"
      :auto-close="false"
      :disabled="!canSubmit"
      :loading="data.loading"
      @confirm="confirmWithdraw"
    >
      <template #body>
        <view class="custom-withdraw-content">
          <view class="withdraw-cell">
            <view class="withdraw-title">银行卡号</view>
            <view class="withdraw-input-content">
              <nut-input
                v-model="data.withdrawInfo.account"
                :border="false"
                class="withdraw-input"
                placeholder-class="withdraw-input-placeholder"
                placeholder="请输入银行卡号"
              />
            </view>
          </view>
          <view class="withdraw-cell">
            <view class="withdraw-title">银行卡用户名</view>
            <view class="withdraw-input-content">
              <nut-input
                v-model="data.withdrawInfo.username"
                :border="false"
                class="withdraw-input"
                placeholder-class="withdraw-input-placeholder"
                placeholder="请输入银行卡用户名"
              />
            </view>
          </view>
          <view class="withdraw-cell">
            <view class="withdraw-title">提现金额</view>
            <view class="withdraw-input-content">
              <nut-input
                v-model="data.withdrawInfo.amount"
                type="digit"
                :border="false"
                class="withdraw-input"
                placeholder-class="withdraw-input-placeholder"
                placeholder="请输入提现金额"
              />
            </view>
          </view>
        </view>
      </template>
    </base-confirm>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { TaroAsync } from '@global/common/taro'
import BaseConfirm from '@/components/base-confirm'
import { saveFile } from '@global/composables/common'
import { useGlobalStore } from '@global/common/store'
import apis from '@global/apis/recharge'

const iconEyeOpen = require('@/assets/imgs/common/icon_eye_open.png')

const iconEyeClose = require('@/assets/imgs/common/icon_eye_close.png')

const globalStore = useGlobalStore()

const { saveImage } = saveFile()

const desensitization = ref(true)

const data = reactive({
  promotionInfo: {
    qrcode: '',
    money: '0.00'
  },
  withdrawInfo: {
    account: '',
    username: '',
    amount: ''
  },
  loading: false,
  withdrawPopup: false
})

const canSubmit = computed(() => {
  return data.withdrawInfo.account && data.withdrawInfo.username && data.withdrawInfo.amount
})

async function getPromotionQrcode () {
  const [res] = await apis.getPromotionQrcode()
  if (res.status === 200) {
    data.promotionInfo.qrcode = res.data.promotion_qrcode || ''
  }
}

async function getPromotionBalance () {
  const [res] = await apis.getPromotionBalance()
  if (res.status === 200) {
    data.promotionInfo.money = res.data.rebate_balance || '0.00'
  }
}

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

async function confirmWithdraw () {
  if (data.withdrawInfo.amount < 100) {
    return Taro.showToast({
      icon: 'none',
      title: '单次提现金额须在100元以上'
    })
  }
  data.loading = true
  const [bankRes] = await apis.getBankInfo({
    bank_card_account: data.withdrawInfo.account
  })
  if (bankRes.status === 200) {
    if (bankRes.data.validated) {
      const [withdrawRes] = await apis.withdraw({
        bank: bankRes.data.bank,
        bank_name: bankRes.data.bank_name,
        bank_card_account: data.withdrawInfo.account,
        bank_card_username: data.withdrawInfo.username,
        amount: data.withdrawInfo.amount
      })
      data.loading = false
      if (withdrawRes.status === 200) {
        data.withdrawPopup = false
        Taro.navigateTo({ url: '/pages/withdraw/index' })
      } else {
        Taro.showToast({
          icon: 'none',
          title: withdrawRes.message || '提现失败'
        })
      }
    } else {
      data.loading = false
      Taro.showToast({
        icon: 'none',
        title: '银行卡账号错误'
      })
    }
  } else {
    data.loading = false
    Taro.showToast({
      icon: 'none',
      title: bankRes.message || '提现失败'
    })
  }
}

useDidShow(() => {
  getPromotionQrcode()
  getPromotionBalance()
})
</script>

<style lang="scss">
@import './index.scss';
</style>

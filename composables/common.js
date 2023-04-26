import only from 'only'
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { TaroAsync } from '@global/common/taro'
import { useGlobalStore } from '@global/common/store'

/**
 * 支付composables api
 */
export function payment () {
  const globalStore = useGlobalStore()

  const rechargePay = (params = {}) => {
    return new Promise(resolve => {
      const interfaceMap = {
        weapp: function () {
          TaroAsync(Taro.requestPayment, only(params, 'timeStamp nonceStr package signType paySign')).then(([res, err]) => {
            // res.errMsg == 'requestPayment:ok'
            if (err) {
              return resolve([{}, { message: '支付失败' }])
            }
            resolve([{ code: 200 }, null])
          })
        },
        /**
         * 支付状态码
         * 4	  无权限调用
         * 9000	订单处理成功
         * 8000	正在处理中。支付结果未知（有可能已经支付成功）
         * 4000	订单处理失败
         * 6001	用户中途取消
         * 6002	网络连接出错
         * 6004	处理结果未知（有可能已经成功）
         */
        alipay: function () {
          TaroAsync(Taro.tradePay, only(params, 'tradeNO orderStr')).then(([res, err]) => {
            if (res.resultCode !== '9000' || err) {
              const status = err?.errorMessage || res?.memo || '支付失败'
              const code = err?.error || res?.resultCode || ''
              return resolve([{}, { message: `${status}${code ? '（状态码：' + code + '）' : ''}` }])
            }
            resolve([{ code: 200 }, null])
          })
        }
      }

      if (!interfaceMap[globalStore.env]) {
        return resolve([{}, { message: '支付失败' }])
      }
      
      interfaceMap[globalStore.env]()
    })
  }

  return {
    rechargePay
  }
}

/**
 * 保存composables api
 */
export function saveFile () {
  const globalStore = useGlobalStore()

  const saving = ref(false)

  const saveImage = async (image) => {
    if (!image || !['weapp', 'alipay'].includes(globalStore.env) || saving.value) return

    saving.value = true

    Taro.showLoading({
      title: '保存中',
      mask: true
    })

    let imagePath = ''

    const reg = new RegExp('^data:image\/([a-zA-z]+);base64,([\\s\\S]*)')

    // base64图片需转为临时文件路径
    if (reg.test(image)) {
      try {
        // 支付宝小程序可以直接报错base64格式图片，不需要转为临时路径
        if (globalStore.env === 'alipay') {
          imagePath = image
        } else if (Taro.getFileSystemManager) {
          const fs = Taro.getFileSystemManager()
          const filePath = `${Taro.env.USER_DATA_PATH}/${new Date().getTime()}.${image.replace(reg, '$1')}`
          if (fs.writeFileSync) {
            fs.writeFileSync(
              filePath,
              image.replace(reg, '$2'),
              'base64'
            )
            imagePath = filePath
          }
        } else {
          return Taro.showToast({
            icon: 'none',
            title: '当前客户端不支持报错base64图片'
          })
        }
      } catch (error) {
        console.log(error.message)
      }
    } else {
      const [imageRes] = await TaroAsync(Taro.getImageInfo, { src: image })
      imagePath = imageRes.path || ''
    }

    if (!imagePath) {
      Taro.hideLoading()
      saving.value = false
      return Taro.showToast({
        icon: 'none',
        title: '获取图片信息失败'
      })
    }

    const [, saveErr] = await TaroAsync(Taro.saveImageToPhotosAlbum, {
      filePath: imagePath
    })

    if (saveErr) {
      Taro.hideLoading()
      saving.value = false
      return Taro.showToast({
        icon: 'none',
        title: saveErr.errorMessage || saveErr.errMsg || '保存失败'
      })
    }

    Taro.hideLoading()
    saving.value = false

    Taro.showToast({
      icon: 'success',
      title: '保存成功'
    })
  }

  return {
    saveImage
  }
}
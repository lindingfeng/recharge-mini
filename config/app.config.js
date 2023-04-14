const config = {
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents',
  // permission: {
  //   'scope.userLocation': {
  //     desc: '您的位置信息将用于小程序位置接口的效果展示'
  //   }
  // },
  // requiredPrivateInfos: [
  //   'getLocation',
  //   'chooseLocation',
  //   'chooseAddress'
  // ]
}

if (process.env.TARO_ENV === 'alipay') {
  config.window.enableInPageRenderInput = 'YES'
}

module.exports = config
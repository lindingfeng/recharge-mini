const config = {
  window: {
    backgroundColorTop: '#C6E6FF',
    navigationBarTitleText: '全酋付',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#C6E6FF'
  }
}

if (process.env.TARO_ENV === 'alipay') {
  config.window.enableInPageRenderInput = 'YES'
}

module.exports = config

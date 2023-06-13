const baseAppConfig = require('../../../config/app.config')
const appConfig = require('./page.config')

export default {
  ...baseAppConfig,
  ...appConfig,
  pages: [
    'pages/index/index',
    'pages/contact/index',
    'pages/user/index',
    'pages/recharge/phone/index',
    'pages/recharge/flow/index',
    'pages/recharge/network-fix-nol/index',
    'pages/recharge/card/index',
    'pages/recharge/salik/index',
    'pages/recharge/traffic/index',
    'pages/recharge/list/index',
    'pages/recharge/detail/index',
    'pages/cashier/index',
    'pages/promote/index',
    'pages/withdraw/index',
    'pages/earnings/index',
    'pages/webview/index'
  ],
  tabBar: {
    color: '#222222',
    selectedColor: '#218cff',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/imgs/tabbar/icon_home_nor.png',
        selectedIconPath: './assets/imgs/tabbar/icon_home_sel.png'
      },
      {
        pagePath: 'pages/contact/index',
        text: '客服',
        iconPath: './assets/imgs/tabbar/icon_contact_nor.png',
        selectedIconPath: './assets/imgs/tabbar/icon_contact_sel.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './assets/imgs/tabbar/icon_user_nor.png',
        selectedIconPath: './assets/imgs/tabbar/icon_user_sel.png'
      }
    ]
  }
}

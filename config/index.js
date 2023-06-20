// export const isProd = __wxConfig ? __wxConfig.envVersion !== 'develop' : true

// 登录接口映射
export const loginMap = {
  recharge: '/user/oauth'
}

// 获取用户信息接口映射
export const getUserInfoMap = {
  recharge: '/user/get_user'
}

// 检查登录态接口映射
export const checkLoginStateMap = {
  recharge: '/user/check'
}

// 环境映射
export const envMap = {
  h5: {
    DEVICE_TYPE: 0,
    CLIENT: 'browserH5',
    DEFAULT_NICKNAME: '网页用户'
  },
  weapp: {
    DEVICE_TYPE: 1,
    CLIENT: 'wechatMini',
    DEFAULT_NICKNAME: '微信用户',
    CODE_STRING: 'wechat_js_code'
  },
  alipay: {
    DEVICE_TYPE: 2,
    CLIENT: 'alipayMini',
    DEFAULT_NICKNAME: '支付宝用户',
    CODE_STRING: 'alipay_auth_code'
  },
  swan: {
    DEVICE_TYPE: 3,
    CLIENT: 'baiduMini',
    DEFAULT_NICKNAME: '百度用户',
    CODE_STRING: 'baidu_auth_code'
  },
  tt: {
    DEVICE_TYPE: 4,
    CLIENT: 'douyinMini',
    DEFAULT_NICKNAME: '抖音用户',
    CODE_STRING: 'douyin_auth_code'
  },
  qq: {
    DEVICE_TYPE: 5,
    CLIENT: 'qqMini',
    DEFAULT_NICKNAME: 'QQ用户',
    CODE_STRING: 'qq_auth_code'
  }
}
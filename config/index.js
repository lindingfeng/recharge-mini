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
    client: 'browserH5'
  },
  weapp: {
    client: 'wechatMini'
  },
  alipay: {
    client: 'alipayMini'
  }
}
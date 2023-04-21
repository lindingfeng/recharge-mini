// export const isProd = __wxConfig ? __wxConfig.envVersion !== 'develop' : true

// 登录接口映射
export const loginMap = {
  recharge: '/user/login'
}

// 登录接口映射
export const checkLoginStateMap = {
  recharge: ''
}

// 环境映射
export const envMap = {
  weapp: {
    DEVICE_TYPE: 1,
  },
  alipay: {
    DEVICE_TYPE: 2
  },
}
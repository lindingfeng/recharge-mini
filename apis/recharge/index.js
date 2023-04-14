import { http } from '@global/apis'

// http.setHooks({
//   // 登录失效跳转登录页
//   onAfterLoginFailure (globalStore, userStore) {
//     Taro.navigateTo({
//       url: '/pages/login/index'
//     })
//   }
// })

export default {
  // 获取广告位
  getBannerList (body) {
    return http.service(`/common/get_banners`, body);
  },
  // 获取所有国家
  getAllCountry (body) {
    return http.service(`/common/get_countries`, body);
  },
  // 获取当前所在国家
  getCurrentCountry (body) {
    return http.service(`/common/get_geo`, body);
  },
  // 切换指定国家
  changeCountry (body) {
    return http.service(`/common/get_current_country`, body);
  },
  // 获取选中国家的服务
  getServices (body) {
    return http.service(`/service/get_services`, body);
  },
  // 获取示例手机号
  getExamples (body) {
    return http.service(`/common/get_example_phone_number`, body);
  },
  // 校验充值手机号
  checkAccount (body) {
    return http.service(`/common/get_operator`, body);
  },
  // 获取运营商列表
  getOperators (body) {
    return http.service(`/common/get_operators`, body);
  },
  // 获取充值列表
  getProducts (body) {
    return http.service(`/product/get_products`, body);
  },
  // 后付费余额查询
  getBalance (body) {
    return http.service(`/common/get_postpaid_account_balance`, body);
  },
  // 获取车辆属地列表
  getCarSources (body) {
    return http.service(`/common/get_car_sources`, body);
  },
  // 获取车辆分类列表
  getCarCategories (body) {
    return http.service(`/common/get_car_categories`, body);
  },
  // 获取车牌代码列表
  getCarCodes (body) {
    return http.service(`/common/get_car_plate_codes`, body);
  },
  // 获取罚款列表
  getFines (body) {
    return http.service(`/common/get_fines`, body);
  },
  // 收银台支付信息
  getPayDetail (body) {
    return http.service(`/pay/get_pay_order`, body);
  },
  // 收银台支付信息
  getPayWays (body) {
    return http.service(`/pay/get_modes`, body);
  },
  // 获取支付参数
  getPayParams (body) {
    return http.service(`/pay/create_pay_order`, body);
  },
  // 获取客服二维码
  getConTactQrcode (body) {
    return http.service(`/common/get_customer_service_qrcode`, body);
  },
  // 获取推广二维码
  getPromotionQrcode (body) {
    return http.service(`/user/get_user_promotion_qrcode`, body);
  },
  // 获取推广返利余额
  getPromotionBalance (body) {
    return http.service(`/user/get_user_promotion_rebate_balance`, body);
  },
  // 识别银行卡
  getBankInfo (body) {
    return http.service(`/common/get_bank_card`, body);
  },
  // 提现
  withdraw (body) {
    return http.service(`/user/user_withdrawal`, body);
  },
  // 获取提现记录
  getWithdrawList (body) {
    return http.service(`/user/get_user_withdrawal_records`, body);
  },
  // 获取返利记录
  getEarningsList (body) {
    return http.service(`/user/get_user_rebate_records`, body);
  },
  // 获取用户信息
  getUserInfo (body) {
    return http.service(`/user/get_user`, body);
  },
  // 获取订单列表
  getRechargeList (body) {
    return http.service(`/order/get_user_orders`, body);
  },
  // 获取订单详情
  getRechargeDetail (body) {
    return http.service(`/order/get_order`, body);
  },
  // 获取未读通知
  getNotice (body) {
    return http.service(`/common/get_unread_popup`, body);
  },
  // 获取系统通知
  getMessageNotice (body) {
    return http.service(`/common/get_notice`, body);
  },
  // 获取用户上次充值成功的订单
  getLatestOrder (body) {
    return http.service(`/order/get_user_latest_success_order`, body);
  },
  // 获取用户功能列表
  getUserFunction (body) {
    return http.service(`/function_access/get_user_page_function_accesses`, body);
  }
}
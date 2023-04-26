import { apiHost as baseUrl, appId, appSecret } from '@/config'
import HttpService from '@global/apis/creator'
import { loginMap, getUserInfoMap, checkLoginStateMap } from '@global/config'

const http = new HttpService({
  appId,
  appSecret,
  config: {
    baseUrl
  }
})

export { http }

export default {
  // 登录
  login (body) {
    return http.service(loginMap[process.env.VUE_APP_PROJECT], body);
  },
  // 获取用户信息
  getUserInfo (body) {
    return http.service(getUserInfoMap[process.env.VUE_APP_PROJECT], body);
  },
  // 检查登录态
  checkLoginState (body) {
    return http.service(checkLoginStateMap[process.env.VUE_APP_PROJECT], body);
  },
  // 绑定用户信息
  bindUserInfo (body) {
    return http.service(`/wechat/bind-user`, body);
  },
  // 文件上传
  uploader (body) {
    return http.uploader(`/api/index/upload`, body);
  },
}
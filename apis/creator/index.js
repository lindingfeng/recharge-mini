import Taro from '@tarojs/taro'
import { TaroAsync } from '@global/common/taro'
import BaseService from '@global/apis/creator/base'

/**
 * @function http子类
 * @param {Object} config Request配置项
 * @param {Object} hooks 各节点hooks
 * @param {String} appSecret 接口验签key
 * @param {Function} userRequeset 自定义请求
 * @param {Function} userResponse 自定义响应
 * @param {Function} userUploadRequest 文件上传自定义响应
 * @param {Function} userUploadResponse 文件上传自定义响应
 */
export default class HttpService extends BaseService {
  constructor (params) {
    super(params)
    this.uploader = null
    this.init()
  }
  /**
   * 创建文件上传实例
   */
   init () {
    this.uploader = (path, body = {}) => {
      return new Promise((resolve) => {
        const formData = this.userRequest({})
        TaroAsync(Taro.uploadFile, {
          url: this.config.baseUrl + path,
          name: body.fileName,
          filePath: body.filePath,
          formData,
        }).then(([response, error]) => {
          resolve(
            error
            ? this.defaultResponseError(error)
            : this.userResponse(response, true)
          )
        })
      })
    }
   }
}
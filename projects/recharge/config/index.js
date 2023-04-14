const baseConfig = require('../../../config/base')

const config = {
  ...baseConfig
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('../../../config/dev'))
  }
  return merge({}, config, require('../../../config/prod'))
}

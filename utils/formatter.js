/**
 * @function 密码正则格式化
 * @param {String} value 输入值
 */
export const pwdFormatter = (value) => {
  return (value.match(/[a-zA-Z0-9\~\!\@\#\$\%\^\&\*\-\_\=\+\,\.\?]/g) || []).join('')
}

/**
 * @function 问答正则格式化
 * @param {String} value 输入值
 */
export const faqFormatter = (value) => {
  return (value.match(/[a-zA-Z0-9\u4e00-\u9fa5\'\"\‘\’\“\”\。\.]/g) || []).join('')
}

/**
 * @function 代币输入格式化
 */
export const currencyFormatter = (value) => {
  if (/^\d+\.\d*$/.test(value)) {
    return value.replace(/^(\d+\.\d{1,6})[0-9]*$/, '$1')
  }
  return String(Number(value))
}
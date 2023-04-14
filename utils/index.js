// import MD5 from 'crypto-js/md5'
import MD5 from 'blueimp-md5'

/**
 * @function request签名
 */
export const createApiSign = (appSecret, body) => {
  const data = { ...body };
  const keyArr = Object.keys(data).sort();
  const kv = [];
  for (let i = 0; i < keyArr.length; i++) {
    if (data.hasOwnProperty(keyArr[i])) {
      if (data[keyArr[i]] === undefined) {
        continue;
      }
      kv.push(keyArr[i] + '=' + data[keyArr[i]]);
    }
  }
  return MD5(MD5(kv.join('&')).toString() + appSecret).toString()
};

export const randomWord = (randomFlag, min, max) => {
  let str = '';
  let range = min;
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};

/**
 * @function 二进制转字符串
 */
export const arrayBufferToString = (buffer) => {
  return Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return String.fromCharCode(bit)
    }
  ).join('')
}

/**
 * @function 字符串转二进制
 */
export const stringToArrayBuffer = (str) => {
  if (!str) {
    return new ArrayBuffer(0)
  }
  let buffer = new ArrayBuffer(str.length)
  let dataView = new Uint8Array(buffer)
  for (let i = 0; i < str.length; i++) {
    dataView[i] = str.charCodeAt(i)
  }
  return buffer
}
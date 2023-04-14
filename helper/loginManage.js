import Taro from '@tarojs/taro'

/* eslint-disable */
const project = process.env.VUE_APP_PROJECT || 'base'

export const getToken = () => {
  return Taro.getStorageSync(`${project}_tc`) || '';
};

export const setToken = token => {
  Taro.setStorageSync(`${project}_tc`, token);
};

export const clearToken = () => {
  Taro.removeStorageSync(`${project}_tc`);
};

export const getUserInfo = (key) => {
  const data = Taro.getStorageSync(`${project}_ui`) || {}
  try {
    if (key) {
      return data[key] || '';
    }
    return data
  } catch (error) {
    if (key) {
      return '';
    }
    return {}
  }
};

export const setUserInfo = (userInfo = {}) => {
  Taro.setStorageSync(`${project}_ui`, userInfo);
};

export const clearUserInfo = () => {
  clearToken();
  Taro.removeStorageSync(`${project}_ui`);
};

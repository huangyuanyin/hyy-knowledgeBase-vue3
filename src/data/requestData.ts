export const baseUrlList = {
  base: import.meta.env.VITE_BASE_URL,
  login: import.meta.env.VITE_BASE_LOGIN_URL,
  drawer: import.meta.env.VITE_BASE_DRAWER_URL
}

export const errorMessages = {
  401: '登录过期，请重新登录!',
  403: '拒绝访问！',
  404: '请求地址出错！',
  500: '服务器内部错误！'
}

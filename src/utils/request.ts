import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
})

service.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    if (config && config.headers.token) {
      config.headers.token = '123'
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    const status = error.response?.status
    switch (status) {
      case 401:
        ElMessage.error('登录过期，请重新登录!')
        break
      case 403:
        ElMessage.error('拒绝访问！')
        break
      case 404:
        ElMessage.error('请求地址出错！')
        break
      case 500:
        ElMessage.error('服务器内部错误！')
        break
      default:
        break
    }
    return Promise.reject(error)
  }
)

export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  post<T = any>(url: string, data?: Object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: Object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}

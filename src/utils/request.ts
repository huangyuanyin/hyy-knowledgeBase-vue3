import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { baseUrlList, errorMessages } from '@/data/requestData'
import { HttpMethod } from '@/data/enums'

const createAxiosInstance = (baseUrlType: keyof typeof baseUrlList): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrlList[baseUrlType],
    timeout: 5000
  })

  instance.interceptors.request.use(
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

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data
    },
    (error: AxiosError) => {
      const status = error.response?.status as keyof typeof errorMessages
      const errorMessage = errorMessages[status] || '未知错误'
      ElMessage.error(errorMessage)
      return Promise.reject(error)
    }
  )

  return instance
}

export const http = {
  request<T = any>(method: HttpMethod, url: string, data?: Object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    const service = createAxiosInstance(baseUrlType)
    return service[method](url, data, config)
  },
  get<T = any>(url: string, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('get', url, undefined, baseUrlType, config)
  },
  post<T = any>(url: string, data?: Object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('post', url, data, baseUrlType, config)
  },
  put<T = any>(url: string, data?: Object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('put', url, data, baseUrlType, config)
  },
  delete<T = any>(url: string, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('delete', url, undefined, baseUrlType, config)
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { baseUrlList, errorMessages } from '@/data/requestData'
import { HttpMethod } from '@/data/enums'

declare module 'axios' {
  interface AxiosRequestConfig {
    paramsHeaderState?: boolean
  }
}

const createAxiosInstance = (baseUrlType: keyof typeof baseUrlList): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrlList[baseUrlType],
    timeout: 100000
  })

  instance.interceptors.request.use(
    async (config: AxiosRequestConfig | any) => {
      config = await modifyRequestConfig(config)
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data.code === 1001 && ['Token解码失败.', 'Token验证失败.'].includes(response.data.msg)) {
        ElMessage.error('登录过期，请重新登录')
        localStorage.clear()
        sessionStorage.clear()
        setTimeout(() => {
          window.location.href = '#/login'
          window.location.reload()
        }, 1500)
      } else {
        return response.data
      }
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

const modifyRequestConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const { url, method, paramsHeaderState, params } = config
  if (url !== 'forum/login/' && !url.includes('public_data/')) {
    const Authorization: string = localStorage.getItem('token') || ''
    config.headers = {
      ...config.headers,
      Authorization
    }
  }
  if (url === 'mine/search/') {
    config.timeout = 100000 * 100000
  }
  if (method === 'get' && paramsHeaderState && params) {
    Object.entries(params).forEach(([key, element]) => {
      config.headers[key] = element
    })
    config.params = {}
  }
  return config
}

export const http = {
  request<T = any>(method: HttpMethod, url: string, data?: Object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    const service = createAxiosInstance(baseUrlType)
    return service[method](url, data, config)
  },
  get<T = any>(url: string, params?: object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request('get', url, params, baseUrlType, config)
  },
  post<T = any>(url: string, data?: object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request('post', url, data, baseUrlType, config)
  },
  put<T = any>(url: string, data?: object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request('put', url, data, baseUrlType, config)
  },
  delete<T = any>(url: string, params?: object, baseUrlType: keyof typeof baseUrlList = 'base', config?: AxiosRequestConfig): Promise<T> {
    return this.request('delete', url, { params }, baseUrlType, config)
  }
}

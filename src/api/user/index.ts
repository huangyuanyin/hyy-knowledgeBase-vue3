import { http } from '@/utils/request'
import { LoginParams, LoginRes } from './types'

export function login(data: LoginParams) {
  return http.post<LoginRes>('forum/login/', data)
}

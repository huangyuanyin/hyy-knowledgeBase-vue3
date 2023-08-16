import { LoginParams, LoginRes } from './type'

export function loginApi(data: LoginParams) {
  return http.post<LoginRes>('forum/login/', data, 'login')
}

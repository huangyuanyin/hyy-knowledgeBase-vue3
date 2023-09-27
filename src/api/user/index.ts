import { LoginParams, LoginRes } from './type'

export function loginApi(data: LoginParams) {
  return http.post<LoginRes>('user/login/', data, 'login')
}

export function selectUserInfoApi(data) {
  return http.post('user/select_UserInfo/', data, 'user')
}

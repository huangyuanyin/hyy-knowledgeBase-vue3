import { LoginParams, LoginRes } from './type'
import { PasswordInfo, UserInfo } from '@/type/user'

export function loginApi(data: LoginParams) {
  return http.post<LoginRes>('oauth/login/', data, 'login')
}

export function getDepartmentsApi(params?: any) {
  return http.get('system/dept_tree/', { params }, 'login')
}

export function getDepartUserApi(params?: any) {
  return http.get('system/dept_user/', { params }, 'login')
}

export function selectUserInfoApi(data) {
  return http.post('user/select_UserInfo/', data, 'user')
}

export function getUserApi(params?: any) {
  return http.get('oauth/user/', { params }, 'login')
}

export function editUserApi(id: number, data: UserInfo) {
  return http.put(`oauth/user_info/${id}/`, data, 'login')
}

export function editPasswordApi(id: number, data: PasswordInfo) {
  return http.put(`oauth/change_password/${id}/`, data, 'login')
}

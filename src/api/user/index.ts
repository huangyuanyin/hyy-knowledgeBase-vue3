import { LoginParams, LoginRes } from './type'

export function loginApi(data: LoginParams) {
  return http.post<LoginRes>('oauth/login/', data, 'login')
}

export function getDepartmentsApi(params?: any) {
  return http.get('system/departments/', { params }, 'login')
}

export function getDepartUserApi(params?: any) {
  return http.get('system/dept_user/', { params }, 'login')
}

export function selectUserInfoApi(data) {
  return http.post('user/select_UserInfo/', data, 'user')
}

export function getUserApi(params?: any) {
  return http.get('http://10.4.150.56:8032/oauth/user/', { params }, 'user')
}

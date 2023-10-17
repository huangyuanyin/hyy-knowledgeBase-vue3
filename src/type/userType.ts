export interface UserInfo {
  name: string
  nickname: string
  username: string
  avatar: string
  role: string
  post: string
  [key: string]: any
}

export interface State {
  token: string
  isAuth: boolean
  userInfo: UserInfo
}

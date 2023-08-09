export interface UserInfo {
  email: string
  nickname: string
  username: string
  role: string
}

export interface State {
  token: string
  isAuth: boolean
  userInfo: UserInfo[]
}

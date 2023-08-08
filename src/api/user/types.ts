export interface LoginParams {
  username: string
  password: string
}

export interface LoginRes {
  code: number
  token: string
}

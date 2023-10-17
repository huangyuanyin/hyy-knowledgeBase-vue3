export interface LoginParams {
  username: string
  password: string
}

export interface LoginRes {
  code: number
  data: object
  msg: string
}

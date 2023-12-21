export interface SearchParams {
  q: string
  type?: string
  sub_type?: string
  scope_id: string
  scope: string
  page?: string
  creator?: string
  time_horizon?: string
}

export interface SearchData {
  [x: string]: any
  username: Array<string>
  space: string
  group: string
  role?: string
}

export interface SearchRes {
  code: number
  data: SearchData
  msg?: string
}

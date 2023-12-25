export interface collaborationsParams {
  content?: string
  book?: string
  id?: number
}

export interface collaborationsData {
  permtype?: string
  permusername?: Array<string> | string
  book?: string
  role?: string
  [x: string]: any
}

export interface collaborationsRes {
  code: number
  data: []
  msg: string
}

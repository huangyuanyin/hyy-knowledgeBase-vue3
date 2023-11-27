export interface collaborationsParams {
  book?: string
  id?: number
  conetnet?: string
}

export interface collaborationsData {
  permtype: string
  permusername: Array<string>
  book: string
  [x: string]: any
}

export interface collaborationsRes {
  code: number
  data: []
  msg: string
}

export interface recyclesParams {
  space?: string
  group?: string
  book?: string
}

export interface recyclesData {
  id: number
  groupname?: string
  name?: string
  title?: string
  creator_name: string
  create_datetime: string
}

export interface recoverData {
  target_id?: number
  action?: string
  type?: string
}

export interface recyclesRes {
  code: number
  data: recyclesData[]
  msg?: string
}

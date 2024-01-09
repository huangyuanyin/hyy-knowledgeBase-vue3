export interface LikeParams {
  target_id: string
  target_type: string
  space: string
}

export interface LikeData {
  target_id: string
  target_type: string
  space: string
  creator: string
  create_datetime: string
}

export interface LikeRes {
  code: number
  data: LikeData
  msg?: string
}

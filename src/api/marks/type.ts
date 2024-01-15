export interface MarksParams {
  space: string
  creator?: string
  target_id?: string
}

export interface MarksData {
  target_type?: string
  target_id?: string
  space?: string
  [x: string]: any
}

export interface MarksRes {
  code: number
  data: MarksData[]
  msg?: string
}

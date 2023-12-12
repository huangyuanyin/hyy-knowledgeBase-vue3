export interface TagParams {
  space: string
  creator?: string
}

export interface TagData {
  name: string
  action_type?: string
  space?: string
  [x: string]: any
}

export interface TagRes {
  code: number
  data: TagData
  msg?: string
}

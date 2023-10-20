export interface SpacepermissionsParams {
  space?: number
}

export interface SpacepermissionsData {
  [key: string]: any
}

export interface SpacepermissionsRes {
  code: number
  data: SpacepermissionsData
  msg?: string
}

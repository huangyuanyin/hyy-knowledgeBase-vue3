export interface SpacepermissionsParams {
  space?: string
}

export interface SpacepermissionsData {
  permusername: Array<string>
  space: string
}

export interface SpacepermissionsRes {
  code: number
  data: SpacepermissionsData
  msg?: string
}

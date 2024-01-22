export interface LogParams {
  request_path: string
  request_method: string
}

export interface LogInfo {
  name: string
  action_type?: string
  space?: string
}

export interface LogRes {
  code: number
  data: LogInfo[]
  msg?: string
}

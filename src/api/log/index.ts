import { LogParams, LogRes } from './type'

export function getOperationlogApi(params: LogParams) {
  return http.get<LogRes>('operationlog/', { params }, 'base')
}

export function getloginLogApi() {
  return http.get<LogRes>('oauth/loginLog/', {}, 'login')
}

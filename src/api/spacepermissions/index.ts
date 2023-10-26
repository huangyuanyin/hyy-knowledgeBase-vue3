import { SpacepermissionsParams, SpacepermissionsData, SpacepermissionsRes } from './type'

export function getSpacepermissionsApi(params: SpacepermissionsParams) {
  return http.get<SpacepermissionsRes>('spacepermissions/', { params }, 'base')
}

export function addSpacepermissionsApi(data: SpacepermissionsData) {
  return http.post<SpacepermissionsRes>('spacepermissions/', data, 'base')
}

export function deleteSpacepermissionsApi(id: number, data?: SpacepermissionsParams) {
  return http.delete<SpacepermissionsRes>(`spacepermissions/${id}/`, data, 'base')
}

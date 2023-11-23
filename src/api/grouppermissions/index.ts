import { GroupPermissionsParams, GroupPermissionsData, GroupPermissionsRes } from './type'

export function getGroupPermissionsApi(params: GroupPermissionsParams) {
  return http.get<GroupPermissionsRes>('group/permissions/', { params }, 'base')
}

export function updateGroupPermissionsApi(id: number, data: GroupPermissionsData) {
  return http.put<GroupPermissionsRes>(`group/permissions/${id}/`, data, 'base')
}

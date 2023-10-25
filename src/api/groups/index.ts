import { groupsParams, groupsData, groupsRes } from './type'

export function getGroupsApi(params: groupsParams) {
  return http.get<groupsRes>('space/groups/', { params }, 'base')
}

export function getGroupsDetailApi(id?: number) {
  return http.get<groupsRes>(`space/groups/${id}/`, {}, 'base')
}

export function addGroupsApi(data: groupsData) {
  return http.post<groupsRes>('space/groups/', data, 'base')
}

export function editGroupsApi(data: groupsParams, id?: number) {
  return http.put<groupsRes>(`space/groups/${id}/`, data, 'base')
}

export function deleteGroupsApi(id?: number) {
  return http.delete<groupsRes>(`space/groups/${id}/`, {}, 'base')
}

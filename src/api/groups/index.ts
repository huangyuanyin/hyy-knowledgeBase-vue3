import { groupsParams, groupsData, groupsRes } from './type'

export function getGroupsApi(params: groupsParams) {
  return http.get<groupsRes>('space/groups/', { params }, 'base')
}

export function addGroupsApi(data: groupsData) {
  return http.post<groupsRes>('space/groups/', data, 'base')
}

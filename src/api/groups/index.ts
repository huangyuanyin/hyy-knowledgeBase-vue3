import { groupsParams, groupsRes } from './type'

export function getGroupsApi(params?: groupsParams) {
  return http.get<groupsRes>('space/groups/', { params }, 'base')
}

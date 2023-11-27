import { TeamMemberParams, TeamMemberData, TeamMemberRes } from './type'

export function getTeamMemberApi(params: TeamMemberParams) {
  return http.get<TeamMemberRes>('group/users/', { params }, 'base')
}

export function addTeamMemberApi(data: TeamMemberData) {
  return http.post<TeamMemberRes>('group/users/', data, 'base')
}

export function editTeamMemberApi(id: number, data: TeamMemberData) {
  return http.put<TeamMemberRes>(`group/users/${id}/`, data, 'base')
}

export function deleteTeamMemberApi(id: number, data?: TeamMemberParams) {
  return http.delete<TeamMemberRes>(`group/users/${id}/`, data, 'base')
}

import { BookStatisticsRes, TeamStatisticsRes, SpaceStatisticsRes } from './type'

export function getBookStatisticApi(id: number) {
  return http.get<BookStatisticsRes>(`book/statistics/${id}/`, {}, 'base')
}

export function getBookDocStatisticApi(id: number, params) {
  return http.get<BookStatisticsRes>(`book/statistic/docs/${id}/`, { params }, 'base')
}

export function getTeamStatisticApi(id: number) {
  return http.get<TeamStatisticsRes>(`group/statistics/${id}/`, {}, 'base')
}

export function getTeamMemberStatisticApi(id: number, params: any) {
  return http.get<TeamStatisticsRes>(`group/statistic/members/${id}/`, { params }, 'base')
}

export function getTeamBookStatisticApi(id: number, params: any) {
  return http.get<TeamStatisticsRes>(`group/statistic/books/${id}/`, { params }, 'base')
}

export function getTeamArticleStatisticApi(id: number, params: any) {
  return http.get<TeamStatisticsRes>(`group/statistic/articles/${id}/`, { params }, 'base')
}

export function getSpaceStatisticApi(id: number) {
  return http.get<SpaceStatisticsRes>(`space/statistics/${id}/`, {}, 'base')
}

export function getSpaceMemberStatisticApi(id: number, params: any) {
  return http.get<SpaceStatisticsRes>(`space/statistic/members/${id}/`, { params }, 'base')
}

export function getSpaceTeamStatisticApi(id: number, params: any) {
  return http.get<SpaceStatisticsRes>(`space/statistic/groups/${id}/`, { params }, 'base')
}

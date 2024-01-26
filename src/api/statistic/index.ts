import { BookStatisticsRes, TeamStatisticsRes } from './type'

export function getBookStatisticApi(id: number) {
  return http.get<BookStatisticsRes>(`book/statistics/${id}/`, {}, 'base')
}

export function getTeamStatisticApi(id: number) {
  return http.get<TeamStatisticsRes>(`group/statistics/${id}/`, {}, 'base')
}

export function getTeamMemberStatisticApi(id: number) {
  return http.get<TeamStatisticsRes>(`group/statistic/members/${id}/`, {}, 'base')
}

export function getTeamBookStatisticApi(id: number) {
  return http.get<TeamStatisticsRes>(`group/statistic/books/${id}/`, {}, 'base')
}

export function getTeamArticleStatisticApi(id: number) {
  return http.get<TeamStatisticsRes>(`group/statistic/articles/${id}/`, {}, 'base')
}
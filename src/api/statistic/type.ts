import { BookStatisticsInfo, TeamStatisticsInfo, SpaceStatisticsInfo } from '@/type/info'

export interface BookStatisticsRes {
  code: number
  data: BookStatisticsInfo
  msg?: string
}

export interface TeamStatisticsRes {
  code: number
  data: TeamStatisticsInfo
  msg?: string
}

export interface SpaceStatisticsRes {
  code: number
  data: SpaceStatisticsInfo
  msg?: string
  total?: number
}

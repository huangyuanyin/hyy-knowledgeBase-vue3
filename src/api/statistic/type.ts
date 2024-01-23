import { BookStatisticsInfo } from '@/type/info'

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

import { BookSettingParams, BookSettingData, BookSettingRes } from './type'

export function getBookSettingApi(params: BookSettingParams) {
  return http.get<BookSettingRes>(`book/settings/`, { params }, 'base')
}

export function updateBookSettingApi(id: number, data: BookSettingData) {
  return http.put<BookSettingRes>(`book/settings/${id}/`, data, 'base')
}

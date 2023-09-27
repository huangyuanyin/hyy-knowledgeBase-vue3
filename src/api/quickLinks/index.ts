import { quickLinksParams, quickLinksData, quickLinksRes } from './type'

export function getQuickLinksApi(params: quickLinksParams) {
  return http.get<quickLinksRes>('quick_links/', { params }, 'base')
}

export function addQuickLinksApi(data: quickLinksData) {
  return http.post<quickLinksRes>('quick_links/', data, 'base')
}

export function deleteQuickLinksApi(id: number, data: quickLinksParams) {
  return http.delete<quickLinksRes>(`quick_links/${id}/`, data, 'base')
}

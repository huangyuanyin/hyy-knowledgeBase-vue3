import { MarksParams, MarksData, MarksRes } from './type'

export function getMarksApi(params: MarksParams) {
  return http.get<MarksRes>('mine/marks/', { params }, 'base')
}

export function addMarksApi(data: MarksData) {
  return http.post<MarksRes>('mine/marks/', data, 'base')
}

export function editMarksApi(id: number, data: MarksData) {
  return http.put<MarksRes>(`mine/marks/${id}/`, data, 'base')
}

export function deleteMarksApi(id: number) {
  return http.delete<MarksRes>(`mine/marks/${id}/`, {}, 'base')
}

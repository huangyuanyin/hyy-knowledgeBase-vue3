import { MarksParams, MarksData, MarksRes } from './type'

export function getMarksApi(params: MarksParams) {
  return http.get<MarksRes>('mine/marks/', { params }, 'base')
}

export function addMarksApi(data: MarksData) {
  return http.post<MarksRes>('mine/marks/', data, 'base')
}

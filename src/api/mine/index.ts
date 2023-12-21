import { SearchParams, SearchRes } from './type'

export function getSearchApi(params: SearchParams) {
  return http.get<SearchRes>('mine/search/', { params }, 'base')
}

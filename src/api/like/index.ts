import { LikeParams, LikeRes } from './type'

export function addLikeApi(data: LikeParams) {
  return http.post<LikeRes>('mine/likes/', data, 'base')
}

export function deleteLikeApi(id: number) {
  return http.delete<LikeRes>(`mine/likes/${id}/`, {}, 'base')
}

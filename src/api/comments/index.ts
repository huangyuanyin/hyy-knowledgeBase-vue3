import { commentsParams, commentsData, commentsRes } from './type'

export function getCommentsApi(params: commentsParams) {
  return http.get<commentsRes>('comments/', { params }, 'base')
}

export function addCommentsApi(data: commentsData) {
  return http.post<commentsRes>(`comments/`, data, 'base')
}

export function deleteCommentsApi(id: number) {
  return http.delete<commentsRes>(`comments/${id}/`, {}, 'base')
}

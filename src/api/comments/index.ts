import { commentsParams, commentsData, commentsRes } from './type'

export function getCommentsApi(params: commentsParams) {
  return http.get<commentsRes>('comments/', { params }, 'base')
}

export function addCommentsApi(data: commentsData) {
  return http.post<commentsRes>(`comments/`, data, 'base')
}

export function editCommentsApi(id: number, data: commentsData) {
  return http.put<commentsRes>(`comments/${id}/`, data, 'base')
}

export function deleteCommentsApi(id: number) {
  return http.delete<commentsRes>(`comments/${id}/`, {}, 'base')
}

export function getCommentTreeApi(id: number) {
  return http.get<commentsRes>(`comment_tree/${id}/`, {}, 'base')
}

export function deleteCommentTreeApi(id: number) {
  return http.delete<commentsRes>(`comment_tree/${id}/`, {}, 'base')
}

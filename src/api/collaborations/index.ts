import { collaborationsParams, collaborationsData, collaborationsRes } from './type'

export function getCollaborationsApi(params: collaborationsParams) {
  return http.get<collaborationsRes>('book/collaborations/', { params }, 'base')
}

export function addCollaborationsApi(data: collaborationsData) {
  return http.post<collaborationsRes>('book/collaborations/', data, 'base')
}

export function editCollaborationsApi(id: number, data: collaborationsData) {
  return http.put<collaborationsRes>(`book/collaborations/${id}/`, data, 'base')
}

export function deleteCollaborationsApi(id: number) {
  return http.delete<collaborationsRes>(`book/collaborations/${id}/`, {}, 'base')
}

export function getArticleCollaborationsApi(params: collaborationsParams) {
  return http.get<collaborationsRes>('article/collaborations/', { params }, 'base')
}

export function addArticleCollaborationsApi(data: collaborationsData) {
  return http.post<collaborationsRes>('article/collaborations/', data, 'base')
}

export function editArticleCollaborationsApi(id: number, data: collaborationsData) {
  return http.put<collaborationsRes>(`article/collaborations/${id}/`, data, 'base')
}

export function deleteArticleCollaborationsApi(id: number) {
  return http.delete<collaborationsRes>(`article/collaborations/${id}/`, {}, 'base')
}

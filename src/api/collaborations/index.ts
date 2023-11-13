import { collaborationsParams, collaborationsData, collaborationsRes } from './type'

export function getCollaborationsApi(params: collaborationsParams) {
  return http.get<collaborationsRes>('book/collaborations/', { params }, 'base')
}

export function addCollaborationsApi(data: collaborationsData) {
  return http.post<collaborationsRes>('book/collaborations/', data, 'base')
}

import { TagParams, TagData, TagRes } from './type'

export function getTagApi(params: TagParams) {
  return http.get<TagRes>('mine/tags/', { params }, 'base')
}

export function addTagApi(data: TagData) {
  return http.post<TagRes>('mine/tags/', data, 'base')
}

export function editTagApi(id: number, data: TagData) {
  return http.put<TagRes>(`mine/tags/${id}/`, data, 'base')
}

export function deleteTagApi(id: number) {
  return http.delete<TagRes>(`mine/tags/${id}/`, {}, 'base')
}

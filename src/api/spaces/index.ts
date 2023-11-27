import { spaceParams, spaceData, spacesRes } from './type'

export function getSpacesApi(params: spaceParams) {
  return http.get<spacesRes>(`spaces/`, { params }, 'base')
}

export function getSpacesDetailApi(id?: number | string) {
  return http.get<spacesRes>(`spaces/${id}/`, {}, 'base')
}

export function addSpaceApi(data: spaceData) {
  return http.post<spacesRes>(`spaces/`, data, 'base')
}

export function editSpacesApi(data: spaceParams, id?: number) {
  return http.put<spacesRes>(`spaces/${id}/`, data, 'base')
}

export function deleteSpacesApi(id?: number) {
  return http.delete<spacesRes>(`spaces/${id}/`, {}, 'base')
}

import { spaceParams, spaceData, spacesRes } from './type'

export function getSpacesApi() {
  return http.get<spacesRes>('spaces/', {}, 'base')
}

export function getSpacesDetailApi(id?: number) {
  return http.get<spacesRes>(`spaces/${id}/`, {}, 'base')
}

export function addSpaceApi(data: spaceData) {
  return http.post<spacesRes>(`spaces/`, data, 'base')
}

export function editSpacesApi(data: spaceParams, id?: number) {
  return http.put<spacesRes>(`spaces/${id}/`, data, 'base')
}

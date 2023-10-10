import { bookstackParams, bookstackData, bookstackRes } from './type'

export function getBookStacksApi(params: bookstackParams) {
  return http.get<bookstackRes>('bookstacks/', { params }, 'base')
}

export function addBookStacksApi(data: bookstackData) {
  return http.post<bookstackRes>('bookstacks/', data, 'base')
}

export function editBookStacksApi(id: number, data: bookstackData) {
  return http.put<bookstackRes>(`bookstacks/${id}/`, data, 'base')
}

export function deleteBookStacksApi(id: number, data: bookstackData) {
  return http.delete<bookstackRes>(`bookstacks/${id}/`, data, 'base')
}

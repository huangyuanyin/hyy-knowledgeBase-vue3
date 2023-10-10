import { libraryParams, libraryRes } from './type'

export function getLibraryApi(params: libraryParams) {
  // return http.get<libraryRes>('books/', { params, paramsHeaderState: true }, 'base')
  return http.get<libraryRes>('books/', { params }, 'base')
}

export function addLibraryApi(data: libraryParams) {
  return http.post<libraryRes>('books/', data, 'base')
}

export function deleteLibraryApi(id: number, data: libraryParams) {
  return http.delete<libraryRes>(`books/${id}`, data, 'base')
}

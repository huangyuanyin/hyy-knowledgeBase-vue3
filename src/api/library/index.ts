import { libraryParams, libraryRes } from './type'

export function getLibraryApi(params: libraryParams) {
  return http.get<libraryRes>('forum/category/', { params, paramsHeaderState: true }, 'base')
}

export function addLibraryApi(data: libraryParams) {
  return http.post<libraryRes>('forum/category/', data, 'base')
}

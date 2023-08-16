import { libraryParams, libraryRes } from './type'

export function getLibraryApi(params: libraryParams) {
  return http.get<libraryRes>('forum/category/', { params, paramsHeaderState: true }, 'base')
}

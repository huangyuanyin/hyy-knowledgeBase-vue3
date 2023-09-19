import { libraryRes } from './type'

export function getForumApi(params: number) {
  return http.get<libraryRes>(`forum/category/${params}/`, {}, 'base')
}

import { articleRes } from './type'

export function getArticleTreeApi(id: string) {
  return http.get<articleRes>(`article_tree/${id}/`, {}, 'base')
}

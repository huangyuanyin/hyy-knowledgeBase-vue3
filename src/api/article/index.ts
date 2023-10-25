import { articleParams, articleRes } from './type'

export function getArticleTreeApi(params: articleParams) {
  return http.get<articleRes>('article_tree/', { params }, 'base')
}

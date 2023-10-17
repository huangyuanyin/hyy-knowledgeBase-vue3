import { articleParams, articleRes } from './type'

export function getArticleApi(params: articleParams) {
  return http.get<articleRes>('article/', { params }, 'base')
}

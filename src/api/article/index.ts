import { ArticleData, ArticleRes } from './type'

export function getArticleTreeApi(id: string) {
  return http.get<ArticleRes>(`article_tree/${id}/`, {}, 'base')
}

export function getArticleApi(id: string) {
  return http.get<ArticleRes>(`article/${id}/`, {}, 'base')
}

export function addArticleApi(data: ArticleData) {
  return http.post<ArticleRes>(`article/`, data, 'base')
}

export function editArticleApi(id: number, data: ArticleData) {
  return http.put<ArticleRes>(`article/${id}/`, data, 'base')
}

export function deleteArticleApi(id: number) {
  return http.delete<ArticleRes>(`article/${id}/`, {}, 'base')
}

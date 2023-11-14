import { ArticleData, ArticleRes } from './type'

export function getArticleTreeApi(id: string) {
  return http.get<ArticleRes>(`article_tree/${id}/`, {}, 'base')
}

export function getArticleApi(id: string) {
  return http.get<ArticleRes>(`articles/${id}/`, {}, 'base')
}

export function addArticleApi(data: ArticleData) {
  return http.post<ArticleRes>(`articles/`, data, 'base')
}

export function editArticleApi(id: number, data: ArticleData) {
  return http.put<ArticleRes>(`articles/${id}/`, data, 'base')
}

export function deleteArticleApi(id: number) {
  return http.delete<ArticleRes>(`articles/${id}/`, {}, 'base')
}

export function uploadArticleApi(data: FormData) {
  return http.post<ArticleRes>(`article_file/`, data, 'base')
}

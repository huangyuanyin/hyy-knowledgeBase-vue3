import { ArticleData, ArticleRes, HandleArticleData, ArticleAttachmentData, ArticleTemData, ArticleVersionData } from './type'

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

export function copyArticleApi(data: HandleArticleData) {
  return http.post<ArticleRes>(`article_copy/`, data, 'base')
}

export function moveArticleApi(data: HandleArticleData) {
  return http.post<ArticleRes>(`article_move/`, data, 'base')
}

export function uploadArticleApi(data: FormData) {
  return http.post<ArticleRes>(`article_file/`, data, 'base')
}

export function exportDocApi(id: number) {
  return http.get<ArticleRes>(`article_export/${id}/`, {}, 'base')
}

export function addArticleAttachmentsApi(data: ArticleAttachmentData) {
  return http.post<ArticleRes>(`article/attachments/`, data, 'base')
}

export function getArticleTemApi(params: ArticleTemData) {
  return http.get<ArticleRes>(`/article/templates/`, { params }, 'base')
}

export function addArticleTemApi(data: ArticleTemData) {
  return http.post<ArticleRes>(`/article/templates/`, data, 'base')
}

export function deleteArticleTemApi(id: number) {
  return http.delete<ArticleRes>(`/article/templates/${id}/`, {}, 'base')
}

export function getArticleVersionApi(params: ArticleVersionData) {
  return http.get<ArticleRes>(`/article/versions/`, { params }, 'base')
}

export function addArticleVersionApi(data: ArticleVersionData) {
  return http.post<ArticleRes>(`/article/versions/`, data, 'base')
}

export function deleteArticleVersionApi(id: number) {
  return http.delete<ArticleRes>(`/article/versions/${id}`, {}, 'base')
}

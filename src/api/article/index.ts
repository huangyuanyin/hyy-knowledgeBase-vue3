import { ArticleData, ArticleParams, ArticleRes, HandleArticleData, ArticleAttachmentData, ArticleTemData, ArticleVersionData, CategoryParams, RecentArticleParams } from './type'

export function getArticleTreeApi(id: string | Number) {
  return http.get<ArticleRes>(`article_tree/${id}/`, {}, 'base')
}

export function getArticleApi(id: number) {
  return http.get<ArticleRes>(`articles/${id}/`, {}, 'base')
}

export function addArticleApi(data: ArticleData) {
  return http.post<ArticleRes>(`articles/`, data, 'base')
}

export function editArticleApi(id: Number, data: ArticleData) {
  return http.put<ArticleRes>(`articles/${id}/`, data, 'base')
}

export function deleteArticleApi(id: Number) {
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

export function exportDocApi(id: Number) {
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

export function deleteArticleTemApi(id: Number) {
  return http.delete<ArticleRes>(`/article/templates/${id}/`, {}, 'base')
}

export function getArticleVersionApi(params: ArticleVersionData) {
  return http.get<ArticleRes>(`/article/versions/`, { params }, 'base')
}

export function addArticleVersionApi(data: ArticleVersionData) {
  return http.post<ArticleRes>(`/article/versions/`, data, 'base')
}

export function deleteArticleVersionApi(id: Number) {
  return http.delete<ArticleRes>(`/article/versions/${id}`, {}, 'base')
}

export function getCategoryTreeApi(params: CategoryParams) {
  return http.get<ArticleRes>(`/category/`, { params }, 'base')
}

export function getDocListApi(params: ArticleParams) {
  return http.get<ArticleRes>(`articles/`, { params }, 'base')
}

export function getRecentArticleListApi(params: RecentArticleParams) {
  return http.get<ArticleRes>(`mine/recent/`, { params }, 'base')
}

import { LogParams, DownloadRes } from './type'

export function downloadArticleApi(id: number) {
  return http.get<DownloadRes>(`article_export/${id}`, {}, 'base')
}

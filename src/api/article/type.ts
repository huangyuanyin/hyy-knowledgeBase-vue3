import { ArticleInfo } from '@/type/article'

export interface ArticleData {
  title: string
  book: string
  space?: string
  type?: String
  parent?: number
  body?: string
  open_window?: string
  [key: string]: any
}

export interface HandleArticleData {
  target_id: number
  target_book_id: number
  node_id: number
  book_id: number
  with_children: boolean
  action: string
}

export interface ArticleAttachmentData {
  content: string
  name: ''
  file: any
}

export interface ArticleTemData {
  name?: string
  body?: string
  icon?: string
  template_type?: string
  target_type?: string
  target_id?: number
  content_type?: string
}

export interface ArticleVersionData {
  id?: number
  name?: string
  body?: string
  content?: string
  type: String
}

export interface ArticleRes<T = ArticleInfo | ArticleInfo[]> {
  code: number
  data: T
  msg?: string
}

export interface CategoryParams {
  node_id: number
  action: string
}

interface article {
  id: number
  title: string
  group: string
  space: string
  creator: string
  body: string
  type: string
  mark_id: number
  tag_mark: string
  marked: boolean
  counts: number
  views: number
  creator_name: string
  create_datetime: string
  update_datetime: string
  [key: string]: any
}

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

export interface ArticleRes {
  code: number
  data: article
  msg?: string
}

interface article {
  id: number
  title: string
  group: string
  space: string
  creator: string
  update_datetime: string
  [key: string]: any
}

export interface ArticleData {
  title: string
  book: string
  space?: string
  type?: string
  parent?: string
  body?: string
  open_window?: string
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

export interface ArticleRes {
  code: number
  data: article
  msg?: string
}

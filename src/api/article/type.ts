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
}

export interface ArticleRes {
  code: number
  data: article
  msg?: string
}

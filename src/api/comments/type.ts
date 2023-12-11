export interface commentsParams {
  content?: string
}

export interface commentsData {
  content: number
  body?: string
  parent?: number
}

export interface commentsRes {
  code: number
  data: commentsData[]
  msg?: string
}

interface article {
  id: number
  title: string
  group: string
  space: string
  creator: string
  update_datetime: string
  [key: string]: any
}

export interface articleRes {
  code: number
  data: article
  msg?: string
}

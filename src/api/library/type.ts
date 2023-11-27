export interface libraryParams {
  space?: string
  group?: string
  creator?: string
}

interface Category {
  id: number
  name: string
  [key: string]: any
}

export interface libraryRes {
  code: number
  data: Category
  msg: string
}

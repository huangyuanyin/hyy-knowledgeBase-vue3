export interface libraryParams {
  Public: 0 | 1
}

interface Category {
  id: number
  name: string
  [key: string]: any
}

export interface libraryRes {
  code: number
  data: Category[]
}

export interface quickLinksParams {
  space: number
  user: string
}

export interface quickLinksData {
  title: string
  target_id: string
  target_type: string
  slug: string
  user: string
  space: number
  [key: string]: any
}

export interface quickLinksRes {
  code: number
  data: quickLinksData
  msg?: string
}

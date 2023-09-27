export interface bookstackParams {
  space: string
  group: string
}

interface Bookstack {
  id: number
  name: string
  is_default: string
  group: string
  space: string
  creator: string
  update_datetime: string
  [key: string]: any
}

export interface bookstackRes {
  code: number
  data: Bookstack
}

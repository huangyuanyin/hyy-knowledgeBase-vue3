export interface spaceParams {
  spacename?: string
  spacekey?: string
  permusername?: string
}

export interface spaceData {
  spacename: string
  spacekey: string
  spacetype: string
  creator?: string
}

interface Spaces {
  id: number
  spacename: string
  spacekey: string
  icon: string
  creator: string
  [key: string]: any
}

export interface spacesRes {
  code: number
  data: Spaces
  msg?: string
}

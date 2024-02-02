export interface spaceParams {
  spacename?: string
  spacekey?: string
  permusername?: string
  is_delete?: string
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
  spacetype: string
  icon: string
  description: string
  creator: string
  members: any[]
  [key: string]: any
}

export interface spacesRes {
  code: number
  data: Spaces
  msg?: string
}

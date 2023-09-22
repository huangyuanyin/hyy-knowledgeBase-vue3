type Spaces = {
  id: number
  spacename: string
  spacekey: string
  icon: string
  creator: string
  [key: string]: any
}

export interface spacesRes {
  code: number
  data: Spaces[]
}

export interface SpaceSettingParams {
  space?: string
}

export interface SpaceSettingData {
  create_group?: string
  space: string
}

interface Spaces {
  id: number
  spacename: string
  spacekey: string
  icon: string
  creator: string
  [key: string]: any
}

export interface SpaceSettingRes {
  code: number
  data: Spaces
  msg?: string
}

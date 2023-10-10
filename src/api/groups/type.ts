export interface groupsParams {
  space: number
}

export interface groupsData {
  groupname: string
  groupkey: string
  space: string
  members: any[]
  description: string
}

interface GroupItem {
  id: number
  groupname: string
  groupkey: string
  creator: string
  [key: string]: any
}

export interface groupsRes {
  code: number
  data: GroupItem[] | number
  msg?: string
}

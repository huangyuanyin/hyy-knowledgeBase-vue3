export interface groupsParams {
  space: number
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
}

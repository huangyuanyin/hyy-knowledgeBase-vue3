export interface GroupPermissionsParams {
  group: string
}

export interface GroupPermissionsData {
  group: string
  create_book?: string
  create_book_collaborator?: string
}

export interface GroupPermissionsRes {
  code: number
  data: any
  msg?: string
}

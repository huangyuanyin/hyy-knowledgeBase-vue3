export interface TeamMemberParams {
  group: string
}

export interface TeamMemberData {
  [x: string]: any
  username: Array<string>
  space: string
  group: string
  role?: string
}

export interface TeamMemberRes {
  code: number
  data: TeamMemberData
  msg?: string
}

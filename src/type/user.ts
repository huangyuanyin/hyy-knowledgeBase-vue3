export interface UserInfo {
  userId?: string
  avatar?: string
  name?: string
  username?: string
  nickname?: string
  post?: string
  dept?: string
  role?: string
  description?: string
}

export interface PasswordInfo {
  oldPassword: string
  newPassword: string
  newPassword2: string
}

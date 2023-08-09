export interface LoginForm {
  username: string
  password: string
}

export interface UseLoginOptions {
  api: (data: Record<string, any>) => Promise<any>
  formRules: Record<string, any>
}

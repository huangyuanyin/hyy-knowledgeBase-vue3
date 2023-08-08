import { defineStore } from 'pinia'

interface UserInfo {
  name: string
  age: number
}

interface State {
  token: string
  isAuth: boolean
  userInfo: UserInfo[]
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: '',
    isAuth: false,
    userInfo: []
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', this.token)
    },
    setIsAuth(isAuth: boolean) {
      this.isAuth = isAuth
    }
  }
})

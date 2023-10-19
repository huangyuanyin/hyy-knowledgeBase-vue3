import jwt_decode from 'jwt-decode'
import { State, UserInfo } from '@/type/userType'

export const useUserStore = defineStore({
  id: 'user',
  state: (): State => ({
    token: '',
    isAuth: false,
    userInfo: {}
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(info: object) {
      this.userInfo = info
    },
    setIsAuth(isAuth: boolean) {
      this.isAuth = isAuth
    }
  },
  persist: true
})

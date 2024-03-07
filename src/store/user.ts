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
      localStorage.setItem('xinAn-token', token)
    },
    setUserInfo(info: object) {
      this.userInfo = info
      localStorage.setItem('xinAn-userInfo', JSON.stringify(info))
    },
    setIsAuth(isAuth: boolean) {
      this.isAuth = isAuth
      localStorage.setItem('isAuth', JSON.stringify(isAuth))
    }
  }
})

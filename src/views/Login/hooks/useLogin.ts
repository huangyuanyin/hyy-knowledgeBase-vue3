import { useUserStore } from '@/store/user'
import { LoginForm, UseLoginOptions } from '../type/login'

export const useLogin = (loginForm: LoginForm = { username: '', password: '' }, options: UseLoginOptions) => {
  const state = reactive({
    loading: false
  })

  const userStore = useUserStore()

  const validateForm = async (formRef: { validate: () => Promise<boolean> | boolean }) => {
    try {
      const valid = await formRef?.validate()
      return valid
    } catch (error) {
      console.error('校验失败', error)
      return false
    }
  }

  const login = async (formRef: { validate: () => Promise<boolean> | boolean }, params = {}) => {
    try {
      const valid = await validateForm(formRef)
      if (!valid) return
      state.loading = true
      const res = await options.api({ ...loginForm, ...params })
      state.loading = false
      if (res.code === 1000) {
        userStore.setToken(res.token)
        userStore.setIsAuth(true)
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error) {
      console.error('登录失败', error)
    }
  }

  const logout = () => {
    userStore.setToken('')
    userStore.setIsAuth(false)
  }

  const isLoggedIn = computed(() => userStore.isAuth)

  return {
    ...toRefs(state),
    login,
    logout,
    isLoggedIn
  }
}

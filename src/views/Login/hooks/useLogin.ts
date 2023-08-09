import { useUserStore } from '@/store/user'
import { LoginForm, UseLoginOptions } from '@/type/loginType'

export const useLogin = (loginForm: LoginForm = { username: '', password: '' }, options: UseLoginOptions) => {
  const state = reactive({
    loading: false
  })

  const userStore = useUserStore()

  const validateForm = async (formRef: { validate: () => Promise<boolean> | boolean }) => {
    const isValid: boolean = await formRef?.validate()
    return isValid
  }

  const showError = (message: string): void => {
    ElMessage.error(message)
  }

  const handleLoginSuccess = (res: any): void => {
    if (res.code === 1000) {
      userStore.setToken(res.token)
      userStore.setIsAuth(true)
      userStore.setUserInfo(res.token)
    } else {
      showError(res.msg)
    }
  }

  const login = async (formRef: { validate: () => Promise<boolean> | boolean }, params = {}) => {
    validateForm(formRef)
      .then((isValid: boolean) => {
        if (!isValid) return
        state.loading = true
        return options.api({ ...loginForm, ...params }) as Promise<any>
      })
      .then((res: any) => {
        state.loading = false
        handleLoginSuccess(res)
      })
      .catch((error: any) => {
        console.error('Form validation failed', error)
        state.loading = false
      })
  }

  const logout = (): void => {
    userStore.setToken('')
    userStore.setIsAuth(false)
  }

  const isLoggedIn = computed<boolean>(() => userStore.isAuth)

  return {
    ...toRefs(state),
    login,
    logout,
    isLoggedIn
  }
}

import { addSpaceApi, getSpacesApi } from '@/api/spaces'
import { useUserStore } from '@/store/user'
import { LoginForm, UseLoginOptions } from '@/type/loginType'
import CryptoJS from 'crypto-js'

export const useLogin = (loginForm: LoginForm = { username: '', password: '' }, options: UseLoginOptions) => {
  const state = reactive({
    loading: false
  })

  const router = useRouter()
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
      userStore.setToken(res.data.token)
      userStore.setIsAuth(true)
      userStore.setUserInfo(res.data)
      ElMessage.success('登录成功')
      router.push({ path: '/' })
    } else {
      showError(res.msg)
    }
  }

  const login = async (formRef: { validate: () => Promise<boolean> | boolean }, params = {}) => {
    validateForm(formRef)
      .then((isValid: boolean) => {
        if (!isValid) return
        state.loading = true
        const params = {
          username: loginForm.username,
          password: loginForm.password
        }
        params.password = CryptoJS.SHA512(loginForm.password).toString(CryptoJS.enc.Base64)
        return options.api({ ...params }) as Promise<any>
      })
      .then(async (res: any) => {
        state.loading = false
        await handleLoginSuccess(res)
        await getSpaces()
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

  const getSpaces = async () => {
    const params = {
      permusername: loginForm.username,
      spacetype: 'personal'
    }
    let res = await getSpacesApi(params)
    if (res.code === 1000) {
      if (res.data.length > 0) return
      addSpace()
    } else {
      ElMessage.error(res.msg)
    }
  }

  const addSpace = async () => {
    const spaceForm = {
      spacename: `${loginForm.username}的空间`,
      spacekey: loginForm.username,
      spacetype: 'personal',
      permusername: loginForm.username
    }
    let res = await addSpaceApi(spaceForm)
    if (res.code !== 1000) {
      ElMessage.error(res.msg)
    }
  }

  const isLoggedIn = computed<boolean>(() => userStore.isAuth)

  return {
    ...toRefs(state),
    login,
    logout,
    isLoggedIn
  }
}

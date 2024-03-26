import { addSpaceApi, getPersonSpaceApi } from '@/api/spaces'
import { useUserStore } from '@/store/user'
import { LoginForm, UseLoginOptions } from '@/type/loginType'
import CryptoJS from 'crypto-js'

export const useLogin = (loginForm: LoginForm = { username: '', password: '' }, options: UseLoginOptions) => {
  const state = reactive({
    loading: false
  })

  const router = useRouter()
  const infoStore = useInfoStore()
  const userStore = useUserStore()
  const nickname = ref('')

  const validateForm = async (formRef: { validate: () => Promise<boolean> | boolean }) => {
    const isValid: boolean = await formRef?.validate()
    return isValid
  }

  const showError = (message: string): void => {
    ElMessage.error(message)
  }

  const setUserInfo = (data: any): void => {
    userStore.setToken(data.token)
    userStore.setIsAuth(true)
    userStore.setUserInfo(data)
  }

  const handleLoginSuccess = async (res: any): Promise<void> => {
    if (res.code === 1000) {
      await setUserInfo(res.data)
      nickname.value = res.data.name
      ElMessage.success('登录成功')
      infoStore.setCurrentSpaceType('个人')
      await getSpaces()
      handleTo()
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
    let res = await getPersonSpaceApi(params)
    if (res.code === 1000) {
      if (res.data.length > 0) {
        localStorage.setItem('personalSpaceInfo', JSON.stringify(res.data[0]))
        handleTo()
      } else {
        addSpace()
      }
    } else {
      ElMessage.error(res.msg)
    }
  }

  const addSpace = async () => {
    const spaceForm = {
      icon: JSON.parse(localStorage.getItem('userInfo')).avatar,
      spacename: `${nickname.value}个人空间`,
      spacekey: loginForm.username,
      spacetype: 'personal',
      permusername: loginForm.username
    }
    let res = await addSpaceApi(spaceForm)
    if (res.code === 1000) {
      localStorage.setItem('personalSpaceInfo', JSON.stringify(res.data))
      infoStore.setCurrentSpaceInfo(res.data)
      handleTo()
    } else {
      ElMessage.error(res.msg)
    }
  }

  const handleTo = () => {
    if (sessionStorage.getItem('to')) {
      let to = sessionStorage.getItem('to')
      sessionStorage.removeItem('to')
      window.open(to as string, '_self')
    } else {
      router.push({ path: '/' })
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

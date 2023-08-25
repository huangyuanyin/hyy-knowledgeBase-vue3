import { useUserStore } from '@/store/user'

export function setupRouterInterceptor(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const store = useUserStore()
  console.log(111, to, from, store.isAuth)
  // if (to.meta.is_login && !store.isAuth) {
  //   ElMessage.error('请先登录')
  //   router.push('/login')
  // }
  next()
}

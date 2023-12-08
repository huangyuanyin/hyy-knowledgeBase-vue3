import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function setupRouterInterceptor(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
  if (to.path === '/directory/sheet/edit' && from.path === '/') {
    const query = to.query
    next({
      path: '/directory/sheet/',
      query
    })
  } else {
    next()
  }
  if (to.path.includes('/recycles')) {
    to.meta.asideComponent = sessionStorage.getItem('currentSidebar')
    next()
  }
}

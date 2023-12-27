import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function setupRouterInterceptor(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const infoStore = useInfoStore()
  infoStore.setCurrentSidebar((to.meta.asideComponent as string) || '')
  infoStore.setCurrentSpaceType(judegeSpaceType(to))
  if (infoStore.currentSidebar === 'DirectorySidebar') {
    if (
      !sessionStorage.getItem('currentBookInfo') ||
      (sessionStorage.getItem('currentBookInfo') && JSON.parse(sessionStorage.getItem('currentBookInfo')).id !== Number(to.query.lid))
    )
      await useBook().getBookInfo(Number(to.query.lid))
  }

  // 如果是团队设置页面，则判断是否需要重新获取团队信息
  if (to.meta.asideComponent === 'TeamSidebar') {
    if (
      !sessionStorage.getItem('xinAn-teamInfo') ||
      (sessionStorage.getItem('xinAn-teamInfo') && JSON.parse(sessionStorage.getItem('xinAn-teamInfo')).id !== Number(to.query.gid))
    ) {
      await useTeam().getTeamInfo(Number(to.query.gid))
    }
  }

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
  if (to.path.includes('/search')) {
    to.meta.asideComponent = sessionStorage.getItem('currentSidebar')
    next()
  }
}

function judegeSpaceType(to: any) {
  const { asideComponent } = to.meta
  switch (asideComponent) {
    case 'SpaceSidebar':
    case 'OrganizeSidebar':
    case 'TeamSidebar':
      return '组织'
    case 'Sidebar':
      return '个人'
    case 'BookSidebar':
    case 'DirectorySidebar':
      return ['bookSetting', 'directory'].includes(to.path.split('/')[1]) ? '个人' : '组织'
  }
}

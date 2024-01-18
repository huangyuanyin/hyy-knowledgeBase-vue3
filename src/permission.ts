import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

let encryptString

const base64UrlEncode = (data) => {
  const encoded = btoa(unescape(encodeURIComponent(data)))
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const base64UrlDecode = (encodedData) => {
  encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/')
  while (encodedData.length % 4) {
    encodedData += '='
  }
  return decodeURIComponent(escape(atob(encodedData)))
}

export async function setupRouterInterceptor(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const infoStore = useInfoStore()

  if (to.meta.menu !== 'login' && Reflect.ownKeys(to.query).length > 0 && !to.query.query) {
    if (to.query.query === infoStore.currentQuery) return
    encryptString = base64UrlEncode(JSON.stringify(to.query))
    infoStore.setCurrentQuery(to.query)
    console.log(`output->当前参数`, to.query, encryptString)
    to.query = {
      query: encryptString
    }
    to.meta = {
      ...to.meta,
      encrypt: encryptString
    }
    router.replace({
      path: to.path,
      query: {
        query: encryptString
      }
    })
  }

  const { lid = '' } = infoStore.currentQuery || {}

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

  if (to.path.includes('/search') || to.path.includes('/recycles')) {
    to.meta.asideComponent = infoStore.currentSpaceType === '个人' ? 'Sidebar' : 'SpaceSidebar'
    next()
  }

  infoStore.setCurrentSidebar(to.meta.asideComponent as string)
  infoStore.setCurrentSpaceType(judegeSpaceType(to))
  infoStore.setCurrentMenu(to.meta.menu as string)

  // 判断是否需要重新获取空间信息
  if (infoStore.currentSpaceType === '个人') await useSpace().getSpaceInfo(null)
  else {
    if (
      !sessionStorage.getItem('xinAn-spaceInfo') ||
      (sessionStorage.getItem('xinAn-spaceInfo') && JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).id !== Number(infoStore.currentQuery?.sid))
    )
      await useSpace().getSpaceInfo(Number(infoStore.currentQuery?.sid))
  }

  // 如果是团队设置页面，则判断是否需要重新获取团队信息
  if (to.meta.asideComponent === 'TeamSidebar') {
    if (
      !sessionStorage.getItem('xinAn-teamInfo') ||
      (sessionStorage.getItem('xinAn-teamInfo') && JSON.parse(sessionStorage.getItem('xinAn-teamInfo')).id !== Number(infoStore.currentQuery?.gid))
    ) {
      await useTeam().getTeamInfo(Number(infoStore.currentQuery?.gid))
    }
  }

  // 如果是知识库目录页面，则判断是否需要重新获取知识库信息
  if (infoStore.currentSidebar === 'DirectorySidebar') {
    if (!sessionStorage.getItem('xinAn-bookInfo') || (sessionStorage.getItem('xinAn-bookInfo') && JSON.parse(sessionStorage.getItem('xinAn-bookInfo')).id !== Number(lid)))
      await useBook().getBookInfo(Number(lid))
  }
}

export async function setupRouterResponder(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const infoStore = useInfoStore()
  if (to.meta.menu !== 'login' && to.query.query) {
    const decrypted = base64UrlDecode(to.query.query)
    infoStore.setCurrentQuery(JSON.parse(decrypted))
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

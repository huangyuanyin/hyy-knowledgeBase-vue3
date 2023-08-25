import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import { setupRouterInterceptor } from '@/permission'

const pages = import.meta.glob('@/views/**/page.ts', {
  eager: true,
  import: 'default'
})
const pageComps = import.meta.glob('@/views/**/index.vue')
const routeList: Array<RouteRecordRaw> = Object.entries(pages).map(([path, meta]) => {
  let pageJsPath = path
  path = path.replace('/src/views', '').replace('/page.ts', '').toLowerCase()
  path = path || '/'
  let name = path.split('/').filter(Boolean).join('-') || 'index'
  name = name.charAt(0).toUpperCase() + name.slice(1)
  const comPath = pageJsPath.replace('page.ts', 'index.vue')
  return {
    path,
    name,
    component: pageComps[comPath] as Component,
    meta
  } as RouteRecordRaw
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [...routeList]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      is_login: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(setupRouterInterceptor)

export default router

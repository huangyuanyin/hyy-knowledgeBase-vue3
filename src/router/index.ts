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

const customRoutes = [
  {
    path: '/:spaceName/dashboard',
    name: 'Space-Dashboard',
    component: pageComps['/src/views/Dashboard/index.vue'] as Component,
    meta: {
      title: '空间·开始',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/collections',
    name: 'Space-Collections',
    component: pageComps['/src/views/Collections/index.vue'] as Component,
    meta: {
      title: '空间·收藏',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/public',
    name: 'Space-Public',
    component: pageComps['/src/views/Public/index.vue'] as Component,
    meta: {
      title: '空间·公共区',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/library',
    name: 'Space-Library',
    component: pageComps['/src/views/Library/index.vue'] as Component,
    meta: {
      title: '空间·知识库',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team',
    name: 'Space-Team',
    component: pageComps['/src/views/Team/index.vue'] as Component,
    meta: {
      title: '空间·团队',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/book',
    name: 'Team-Book',
    component: pageComps['/src/views/Team/Book/index.vue'] as Component,
    meta: {
      title: '团队·知识库',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/dynamic',
    name: 'Team-Dynamic',
    component: pageComps['/src/views/Team/Dynamic/index.vue'] as Component,
    meta: {
      title: '团队·动态',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/Topic',
    name: 'Team-Topic',
    component: pageComps['/src/views/Team/Topic/index.vue'] as Component,
    meta: {
      title: '团队·话题',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/member',
    name: 'Team-Member',
    component: pageComps['/src/views/Team/Member/index.vue'] as Component,
    meta: {
      title: '团队·成员',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/directory/index',
    name: 'Space-Directory',
    component: pageComps['/src/views/Directory/index.vue'] as Component,
    meta: {
      title: '知识库详情',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/directory/index',
    name: 'Directory',
    component: pageComps['/src/views/Directory/index.vue'] as Component,
    meta: {
      title: '知识库详情',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName/directory/article',
    name: 'Space-Article',
    component: pageComps['/src/views/Article/index.vue'] as Component,
    meta: {
      title: '文章详情',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName/organize/dashboard',
    name: 'Organize-Dashboard',
    component: pageComps['/src/views/Organize/Dashboard/index.vue'] as Component,
    meta: {
      title: '空间管理·开始',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/settings',
    name: 'Organize-Settings',
    component: pageComps['/src/views/Organize/SpaceSetting/SpaceInfo/index.vue'] as Component,
    meta: {
      title: '空间管理·信息',
      asideComponent: 'OrganizeSidebar'
    }
  }
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [...routeList, ...customRoutes]
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

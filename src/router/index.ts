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
    path: '/:spaceName?/directory/index',
    name: 'Space-Directory',
    component: pageComps['/src/views/Directory/index.vue'] as Component,
    meta: {
      title: '知识库详情',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/doc/:isEdit?',
    name: 'Space-Article',
    component: pageComps['/src/views/Article/Doc/index.vue'] as Component,
    meta: {
      title: '文档',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/sheet/:isEdit?',
    name: 'Space-Sheet',
    component: pageComps['/src/views/Article/Sheet/index.vue'] as Component,
    meta: {
      title: '数据表',
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
    path: '/:spaceName/organize/addressBook',
    name: 'Organize-AddressBook',
    component: pageComps['/src/views/Organize/PeoplePermissions/AddressBook/index.vue'] as Component,
    meta: {
      title: '空间管理·通讯录',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/permission',
    name: 'Organize-Permission',
    component: pageComps['/src/views/Organize/PeoplePermissions/Permission/index.vue'] as Component,
    meta: {
      title: '空间管理·权限设置',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/administrator',
    name: 'Organize-Administrator',
    component: pageComps['/src/views/Organize/PeoplePermissions/Administrator/index.vue'] as Component,
    meta: {
      title: '空间管理·管理员设置',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/teamManage',
    name: 'Organize-TeamManage',
    component: pageComps['/src/views/Organize/TeamManage/index.vue'] as Component,
    meta: {
      title: '空间管理·团队管理',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/settings',
    name: 'Organize-Settings',
    component: pageComps['/src/views/Organize/SpaceSetting/SpaceInfo/index.vue'] as Component,
    meta: {
      title: '空间管理·空间信息',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/preference',
    name: 'Organize-Preference',
    component: pageComps['/src/views/Organize/SpaceSetting/Preference/index.vue'] as Component,
    meta: {
      title: '空间管理·偏好设置',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/advancedSet',
    name: 'Organize-AdvancedSet',
    component: pageComps['/src/views/Organize/SpaceSetting/AdvancedSet/index.vue'] as Component,
    meta: {
      title: '空间管理·高级设置',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/recycleBin',
    name: 'Organize-RecycleBin',
    component: pageComps['/src/views/Organize/RecycleBin/index.vue'] as Component,
    meta: {
      title: '空间管理·回收站',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/basic',
    name: 'Team-Basic',
    component: pageComps['/src/views/TeamSetting/Basic/index.vue'] as Component,
    meta: {
      title: '团队管理·团队信息',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/permission',
    name: 'Team-Permission',
    component: pageComps['/src/views/TeamSetting/Permission/index.vue'] as Component,
    meta: {
      title: '团队管理·权限',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/settings',
    name: 'Team-Settings',
    component: pageComps['/src/views/TeamSetting/Settings/index.vue'] as Component,
    meta: {
      title: '团队管理·更多设置',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/trash',
    name: 'Team-Trash',
    component: pageComps['/src/views/TeamSetting/Trash/index.vue'] as Component,
    meta: {
      title: '团队管理·回收站',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/basic',
    name: 'Book-Basic',
    component: pageComps['/src/views/Book/Basic/index.vue'] as Component,
    meta: {
      title: '知识库管理·信息',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/collaborators',
    name: 'Book-Collaborators',
    component: pageComps['/src/views/Book/Collaborators/index.vue'] as Component,
    meta: {
      title: '知识库管理·权限',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/settings',
    name: 'Book-Advanced',
    component: pageComps['/src/views/Book/Advanced/index.vue'] as Component,
    meta: {
      title: '知识库管理·更多设置',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/toc',
    name: 'Book-Toc',
    component: pageComps['/src/views/Book/Toc/index.vue'] as Component,
    meta: {
      title: '知识库管理·目录管理',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/docs',
    name: 'Book-Docs',
    component: pageComps['/src/views/Book/Docs/index.vue'] as Component,
    meta: {
      title: '知识库管理·文档管理',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/webhooks',
    name: 'Book-Webhooks',
    component: pageComps['/src/views/Book/Webhooks/index.vue'] as Component,
    meta: {
      title: '知识库管理·消息推送',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/trash',
    name: 'Book-Trash',
    component: pageComps['/src/views/Book/Trash/index.vue'] as Component,
    meta: {
      title: '知识库管理·回收站',
      asideComponent: 'BookSidebar'
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

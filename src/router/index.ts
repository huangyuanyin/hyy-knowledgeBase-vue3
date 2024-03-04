import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import { setupRouterInterceptor, setupRouterResponder } from '@/permission'

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
      menu: 'dashboard',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/collections',
    name: 'Space-Collections',
    component: pageComps['/src/views/Collections/index.vue'] as Component,
    meta: {
      title: '空间·收藏',
      menu: 'collections',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/public',
    name: 'Space-Public',
    component: pageComps['/src/views/Public/index.vue'] as Component,
    meta: {
      title: '空间·公共区',
      menu: 'public',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/library',
    name: 'Space-Library',
    component: pageComps['/src/views/Library/index.vue'] as Component,
    meta: {
      title: '空间·知识库',
      menu: 'library',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team',
    name: 'Space-Team',
    component: pageComps['/src/views/Team/index.vue'] as Component,
    meta: {
      title: '空间·团队',
      menu: 'team',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/book',
    name: 'Team-Book',
    component: pageComps['/src/views/Team/Book/index.vue'] as Component,
    meta: {
      title: '团队·知识库',
      menu: 'team',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/dynamic',
    name: 'Team-Dynamic',
    component: pageComps['/src/views/Team/Dynamic/index.vue'] as Component,
    meta: {
      title: '团队·动态',
      menu: 'team',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/Topic',
    name: 'Team-Topic',
    component: pageComps['/src/views/Team/Topic/index.vue'] as Component,
    meta: {
      title: '团队·话题',
      menu: 'team',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName/team/member',
    name: 'Team-Member',
    component: pageComps['/src/views/Team/Member/index.vue'] as Component,
    meta: {
      title: '团队·成员',
      menu: 'team',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName?/directory/index',
    name: 'Space-Directory',
    component: pageComps['/src/views/Directory/index.vue'] as Component,
    meta: {
      title: '知识库目录',
      menu: 'directory',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/doc/:isEdit?',
    name: 'Space-Article',
    component: pageComps['/src/views/Article/Doc/index.vue'] as Component,
    meta: {
      title: '文档',
      menu: 'doc',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/sheet/:isEdit?',
    name: 'Space-Sheet',
    component: pageComps['/src/views/Article/Sheet/index.vue'] as Component,
    meta: {
      title: '数据表',
      menu: 'sheet',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/ppt/:isEdit?',
    name: 'Space-PPT',
    component: pageComps['/src/views/Article/PPT/index.vue'] as Component,
    meta: {
      title: 'PPT',
      menu: 'ppt',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/mind/:isEdit?',
    name: 'Space-Mindmap',
    component: pageComps['/src/views/Article/MindMap/index.vue'] as Component,
    meta: {
      title: 'Mindmap',
      menu: 'mind',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/file',
    name: 'Space-File',
    component: pageComps['/src/views/Article/File/index.vue'] as Component,
    meta: {
      title: '文件',
      menu: 'file',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName?/directory/title',
    name: 'Space-title',
    component: pageComps['/src/views/Article/Title/index.vue'] as Component,
    meta: {
      title: '文件',
      menu: 'title',
      asideComponent: 'DirectorySidebar'
    }
  },
  {
    path: '/:spaceName/organize/dashboard',
    name: 'Organize-Dashboard',
    component: pageComps['/src/views/Organize/Dashboard/index.vue'] as Component,
    meta: {
      title: '空间管理·开始',
      menu: 'dashboard',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/addressBook',
    name: 'Organize-AddressBook',
    component: pageComps['/src/views/Organize/PeoplePermissions/AddressBook/index.vue'] as Component,
    meta: {
      title: '空间管理·通讯录',
      menu: 'addressBook',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/permission',
    name: 'Organize-Permission',
    component: pageComps['/src/views/Organize/PeoplePermissions/Permission/index.vue'] as Component,
    meta: {
      title: '空间管理·权限设置',
      menu: 'permission',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/administrator',
    name: 'Organize-Administrator',
    component: pageComps['/src/views/Organize/PeoplePermissions/Administrator/index.vue'] as Component,
    meta: {
      title: '空间管理·管理员设置',
      menu: 'administrator',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/teamManage',
    name: 'Organize-TeamManage',
    component: pageComps['/src/views/Organize/TeamManage/index.vue'] as Component,
    meta: {
      title: '空间管理·团队管理',
      menu: 'teamManage',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/settings',
    name: 'Organize-Settings',
    component: pageComps['/src/views/Organize/SpaceSetting/SpaceInfo/index.vue'] as Component,
    meta: {
      title: '空间管理·空间信息',
      menu: 'settings',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/preference',
    name: 'Organize-Preference',
    component: pageComps['/src/views/Organize/SpaceSetting/Preference/index.vue'] as Component,
    meta: {
      title: '空间管理·偏好设置',
      menu: 'preference',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/advancedSet',
    name: 'Organize-AdvancedSet',
    component: pageComps['/src/views/Organize/SpaceSetting/AdvancedSet/index.vue'] as Component,
    meta: {
      title: '空间管理·高级设置',
      menu: 'advancedSet',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/deleteProcess',
    name: 'Organize-DeleteProcess',
    component: pageComps['/src/views/Organize/DeleteProcess/index.vue'] as Component,
    meta: {
      title: '空间管理·删除流程',
      menu: 'deleteProcess',
      asideComponent: 'noSidebar'
    }
  },
  {
    path: '/:spaceName/organize/statistics',
    name: 'Organize-Statistics',
    component: pageComps['/src/views/Organize/Statistics/index.vue'] as Component,
    meta: {
      title: '空间管理·统计',
      menu: 'statistics',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/organize/recycleBin',
    name: 'Organize-RecycleBin',
    component: pageComps['/src/views/Organize/RecycleBin/index.vue'] as Component,
    meta: {
      title: '空间管理·回收站',
      menu: 'recycleBin',
      asideComponent: 'OrganizeSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/basic',
    name: 'Team-Basic',
    component: pageComps['/src/views/TeamSetting/Basic/index.vue'] as Component,
    meta: {
      title: '团队管理·团队信息',
      menu: 'basic',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/permission',
    name: 'Team-Permission',
    component: pageComps['/src/views/TeamSetting/Permission/index.vue'] as Component,
    meta: {
      title: '团队管理·权限',
      menu: 'permission',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/settings',
    name: 'Team-Settings',
    component: pageComps['/src/views/TeamSetting/Settings/index.vue'] as Component,
    meta: {
      title: '团队管理·更多设置',
      menu: 'settings',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/statistics',
    name: 'Team-Statistics',
    component: pageComps['/src/views/TeamSetting/Statistics/index.vue'] as Component,
    meta: {
      title: '团队管理·统计',
      menu: 'statistics',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName/teamSetting/trash',
    name: 'Team-Trash',
    component: pageComps['/src/views/TeamSetting/Trash/index.vue'] as Component,
    meta: {
      title: '团队管理·回收站',
      menu: 'trash',
      asideComponent: 'TeamSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/basic',
    name: 'Book-Basic',
    component: pageComps['/src/views/Book/Basic/index.vue'] as Component,
    meta: {
      title: '知识库管理·信息',
      menu: 'basic',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/collaborators',
    name: 'Book-Collaborators',
    component: pageComps['/src/views/Book/Collaborators/index.vue'] as Component,
    meta: {
      title: '知识库管理·权限',
      menu: 'collaborators',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/settings',
    name: 'Book-Advanced',
    component: pageComps['/src/views/Book/Advanced/index.vue'] as Component,
    meta: {
      title: '知识库管理·更多设置',
      menu: 'settings',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/statistics',
    name: 'Book-Statistics',
    component: pageComps['/src/views/Book/Statistics/index.vue'] as Component,
    meta: {
      title: '知识库管理·统计',
      menu: 'statistics',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/toc',
    name: 'Book-Toc',
    component: pageComps['/src/views/Book/Toc/index.vue'] as Component,
    meta: {
      title: '知识库管理·目录管理',
      menu: 'toc',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/docs',
    name: 'Book-Docs',
    component: pageComps['/src/views/Book/Docs/index.vue'] as Component,
    meta: {
      title: '知识库管理·文档管理',
      menu: 'docs',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/webhooks',
    name: 'Book-Webhooks',
    component: pageComps['/src/views/Book/Webhooks/index.vue'] as Component,
    meta: {
      title: '知识库管理·消息推送',
      menu: 'webhooks',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/bookSetting/trash',
    name: 'Book-Trash',
    component: pageComps['/src/views/Book/Trash/index.vue'] as Component,
    meta: {
      title: '知识库管理·回收站',
      menu: 'trash',
      asideComponent: 'BookSidebar'
    }
  },
  {
    path: '/:spaceName?/recycles',
    name: 'Recycles',
    component: pageComps['/src/views/Recycles/index.vue'] as Component,
    meta: {
      title: '回收站',
      menu: 'recycles',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName?/search',
    name: 'Search',
    component: pageComps['/src/views/Search/index.vue'] as Component,
    meta: {
      title: '搜索',
      menu: 'search',
      asideComponent: 'SpaceSidebar'
    }
  },
  {
    path: '/:spaceName?/user/profile',
    name: 'Profile',
    component: pageComps['/src/views/User/Profile/index.vue'] as Component,
    meta: {
      title: '个人中心·个人信息',
      menu: 'profile',
      asideComponent: 'UserSidebar'
    }
  },
  {
    path: '/:spaceName?/user/safety',
    name: 'Safety',
    component: pageComps['/src/views/User/Safety/index.vue'] as Component,
    meta: {
      title: '个人中心·安全日志',
      menu: 'safety',
      asideComponent: 'UserSidebar'
    }
  },
  {
    path: '/:spaceName?/user/account',
    name: 'Account',
    component: pageComps['/src/views/User/Account/index.vue'] as Component,
    meta: {
      title: '个人中心·账户管理',
      menu: 'account',
      asideComponent: 'UserSidebar'
    }
  },
  {
    path: '/:spaceName?/user/stats',
    name: 'Stats',
    component: pageComps['/src/views/User/Stats/index.vue'] as Component,
    meta: {
      title: '个人中心·数据统计',
      menu: 'stats',
      asideComponent: 'UserSidebar'
    }
  },
  {
    path: '/:spaceName?/user/grains',
    name: 'Grains',
    component: pageComps['/src/views/User/Grains/index.vue'] as Component,
    meta: {
      title: '个人中心·安币',
      menu: 'grains',
      asideComponent: 'UserSidebar'
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
      menu: 'login',
      is_login: true
    }
  },
  {
    path: '/no-permission',
    name: 'Permission',
    component: () => import('@/views/NoPermission/index.vue'),
    meta: {
      title: '无权限'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory('/netKmp/'),
  routes
})

router.beforeEach(setupRouterInterceptor)

router.afterEach(setupRouterResponder)

export default router

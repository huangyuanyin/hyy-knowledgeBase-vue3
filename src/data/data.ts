export const menuItemsData = [
  { type: 'item', icon: '/src/assets/icons/documentIcon.svg', label: '文档' },
  { type: 'item', icon: '/src/assets/icons/formIcon.svg', label: '表格' },
  { type: 'item', icon: '/src/assets/icons/mindmapIcon.svg', label: '思维导图' },
  { type: 'item', icon: '/src/assets/icons/pptIcon.svg', label: '幻灯片' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/bookIcon.svg', label: '知识库' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/templateIcon.svg', label: '从模板新建' },
  { type: 'item', icon: '/src/assets/icons/importIcon.svg', label: '导入...' }
]

export const spaceMenuItemsData = [
  { type: 'item', icon: '/src/assets/icons/documentIcon.svg', label: '文档' },
  { type: 'item', icon: '/src/assets/icons/formIcon.svg', label: '表格' },
  { type: 'item', icon: '/src/assets/icons/mindmapIcon.svg', label: '思维导图' },
  { type: 'item', icon: '/src/assets/icons/pptIcon.svg', label: '幻灯片' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/bookIcon.svg', label: '知识库', nick: 'toAddBook' },
  { type: 'item', icon: '/src/assets/icons/teamIcon.svg', label: '团队', nick: 'toAddTeam' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/templateIcon.svg', label: '从模板新建' },
  { type: 'item', icon: '/src/assets/icons/importIcon.svg', label: '导入...' }
]

export const sidebarSearchMenuItemsData = [
  { type: 'item', icon: '/src/assets/icons/documentIcon.svg', label: '文档', nick: 'toAddDoc' },
  { type: 'item', icon: '/src/assets/icons/formIcon.svg', label: '表格', nick: 'toAddSheet' },
  { type: 'item', icon: '/src/assets/icons/mindmapIcon.svg', label: '思维导图' },
  { type: 'item', icon: '/src/assets/icons/pptIcon.svg', label: '幻灯片' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/templateIcon.svg', label: '从模板新建' },
  { type: 'item', icon: '/src/assets/icons/importIcon.svg', label: '导入...' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/groupIcon.svg', label: '新建分组' },
  { type: 'item', icon: '/src/assets/icons/linkIcon.svg', label: '添加链接' }
]

export const moduleAddMenuData = [
  { type: 'item', icon: '/src/assets/icons/documentIcon.svg', label: '新建文档' },
  { type: 'item', icon: '/src/assets/icons/formIcon.svg', label: '新建表格' },
  { type: 'item', icon: '/src/assets/icons/mindmapIcon.svg', label: '新建思维导图' },
  { type: 'item', icon: '/src/assets/icons/pptIcon.svg', label: '新建幻灯片' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/importIcon.svg', label: '导入...' }
]

export const libraryOperationData = [
  { type: 'item', icon: '/src/assets/icons/commonUseIcon.svg', label: '移除常用', nick: 'toRemoveCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '权限', nick: 'toPermission' },
  { type: 'item', icon: '/src/assets/icons/menuIcon.svg', label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/deleteIcon.svg', label: '删除', nick: 'toDeleteLibrary' }
]

export const teamOperationData = [
  { type: 'item', icon: '/src/assets/icons/team/bookIcon.svg', label: '知识库', nick: 'toBook' },
  { type: 'item', icon: '/src/assets/icons/team/topicIcon.svg', label: '话题', nick: 'toTopic' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/team/removeCommonIcon.svg', label: '移除常用', nick: 'toRemoveCommon' },
  { type: 'item', icon: '/src/assets/icons/team/reminderFreeIcon.svg', label: '动态免提醒', nick: 'toReminderFree' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/team/settingIcon.svg', label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: '/src/assets/icons/team/editIcon.svg', label: '退出团队', nick: 'toQuitTeam' }
]

export const moreOperationData = [
  { type: 'detailItem', icon: '/src/assets/icons/deleteIcon.svg', label: '回收站', desc: '找回删除的文档与内容' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '产品计划' },
  { type: 'item', icon: '/src/assets/icons/menuIcon.svg', label: '我要反馈' }
]

export const commonLibraryData = [
  { type: 'item', icon: '/src/assets/icons/commonUseIcon.svg', label: '移除常用', nick: 'removeCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '权限', nick: 'toPermission' },
  { type: 'item', icon: '/src/assets/icons/renameIcon.svg', label: '重命名', nick: 'toRename' },
  { type: 'item', icon: '/src/assets/icons/menuIcon.svg', label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/deleteIcon.svg', label: '删除', nick: 'deleteLibrary' }
]

export const notCommonLibraryData = [
  { type: 'item', icon: '/src/assets/icons/pinOutIcon.svg', label: '常用', nick: 'addCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '权限', nick: 'toPermission' },
  { type: 'item', icon: '/src/assets/icons/renameIcon.svg', label: '重命名', nick: 'toRename' },
  { type: 'item', icon: '/src/assets/icons/menuIcon.svg', label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/deleteIcon.svg', label: '删除', nick: 'deleteLibrary' }
]

export const articleOperationData = [
  { type: 'item', icon: '/src/assets/icons/article/renameIcon.svg', label: '重命名', nick: 'toRename' },
  { type: 'item', icon: '/src/assets/icons/article/editIcon.svg', label: '编辑文档', nick: 'removeCommon' },
  { type: 'item', icon: '/src/assets/icons/article/copyLinkIcon.svg', label: '复制链接', nick: 'removeCommon' },
  { type: 'item', icon: '/src/assets/icons/article/addTabIcon.svg', label: '在新标签页打开', nick: 'removeCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '移除目录', nick: 'permission' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/article/copyIcon.svg', label: '复制', nick: 'rename' },
  { type: 'item', icon: '/src/assets/icons/article/moveIcon.svg', label: '移动', nick: 'moveArticle' },
  { type: 'item', icon: '/src/assets/icons/article/exportIcon.svg', label: '导出', nick: 'moreSetting' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/deleteIcon.svg', label: '删除', nick: 'toDeleteArticle' }
]

export const cooperateLink =
  'https://www.yuque.com/g/huangyuany/acb0b7/qbkoa01e902gmggk/collaborator/join?token=nx2jY3PCgd0MuLxP&source=doc_collaborator&goto=%2Fhuangyuany%2Facb0b7%2Fqbkoa01e902gmggk%2Fedit# 邀请你共同编辑表格《无标题表格》'

export const moduleData = [
  {
    id: 1,
    icon: '/src/assets/icons/docModuleIcon.svg',
    title: '新建文档',
    description: '文档、表格、画板、数据表',
    rightIcon: '/src/assets/icons/downIcon.svg'
  },
  {
    id: 2,
    icon: '/src/assets/icons/bookModuleIcon.svg',
    title: '新建知识库',
    description: '使用知识库整理知识'
  },
  {
    id: 3,
    icon: '/src/assets/icons/temeplateModuleIcon.svg',
    title: '模板中心',
    description: '从模板中获取灵感'
  }
]

export const documentsData = [
  {
    id: 1,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 2,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 3,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },

  {
    id: 4,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 5,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 6,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 7,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 8,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 9,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 10,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 11,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  },
  {
    id: 12,
    icon: '/src/assets/icons/documentIcon.svg',
    title: '无标题文档',
    username: '就叫小黄好了',
    library: '让4月3让3让3',
    time: '08-18 16:43'
  }
]

export const moreMenuItemsData = [{ icon: '/src/assets/icons/moreIcon2.svg', label: '更多' }]

export const contentItemsData = [
  {
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    typeIcon: '/src/assets/icons/publicIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: []
  }
]

export const organizeMenu = [
  {
    id: 1,
    title: '空间总览',
    icon: '/src/assets/icons/organize/spaceIcon.svg',
    url: '/dashboard',
    nick: 'dashboard',
    children: []
  },
  {
    id: 2,
    title: '人员与权限',
    icon: '/src/assets/icons/organize/memberIcon.svg',
    children: [
      {
        id: 201,
        title: '通讯录',
        url: '/addressBook',
        nick: 'addressBook',
        icon: '',
        children: []
      },
      {
        id: 202,
        title: '权限设置',
        url: '/permission',
        nick: 'permission',
        icon: '',
        children: []
      },
      {
        id: 203,
        title: '管理员设置',
        url: '/administrator',
        nick: 'administrator',
        icon: '',
        children: []
      }
    ]
  },
  {
    id: 3,
    title: '团队管理',
    icon: '/src/assets/icons/organize/teamIcon.svg',
    url: '/teamManage',
    nick: 'teamManage',
    children: []
  },
  {
    id: 4,
    title: '空间设置',
    icon: '/src/assets/icons/organize/setIcon.svg',
    children: [
      {
        id: 401,
        title: '空间信息',
        icon: '',
        url: '/settings',
        nick: 'settings',
        children: []
      },
      {
        id: 402,
        title: '偏好设置',
        url: '/preference',
        nick: 'preference',
        icon: '',
        children: []
      },
      {
        id: 403,
        title: '高级设置',
        icon: '',
        url: '/advancedSet',
        nick: 'advancedSet',
        children: []
      }
    ]
  },
  {
    id: 5,
    title: '回收站',
    icon: '/src/assets/icons/organize/deleteIcon.svg',
    url: '/recycleBin',
    nick: 'recycleBin',
    children: []
  }
]

export const spaceStartBox = [
  {
    title: '管理通讯录',
    description: '导入或邀请成员加入空间协作',
    url: '/addressBook'
  },
  {
    title: '管理团队',
    description: '通过团队来组织项目和人员',
    url: '/teamManage'
  },
  {
    title: '权限设置',
    description: '通过权限来保障空间安全',
    url: '/permission'
  },
  {
    title: '偏好设置',
    description: '通过偏好来设置多彩空间',
    url: '/preference'
  }
]

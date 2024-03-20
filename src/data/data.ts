import docModuleIcon from '@/assets/icons/docModuleIcon.svg'
import bookModuleIcon from '@/assets/icons/bookModuleIcon.svg'
import temeplateModuleIcon from '@/assets/icons/temeplateModuleIcon.svg'
import documentIcon from '@/assets/icons/documentIcon.svg'
import folderIcon from '@/assets/icons/folder.svg'
import spaceIcon from '@/assets/icons/organize/spaceIcon.svg'
import deleteIcon from '@/assets/icons/organize/deleteIcon.svg'
import setIcon from '@/assets/icons/organize/setIcon.svg'
import memberIcon from '@/assets/icons/organize/memberIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'
import fileIcon from '@/assets/icons/fileIcon.svg'
import bookIcon from '@/assets/icons/bookIcon.svg'
import templateIcon from '@/assets/icons/templateIcon.svg'
import importIcon from '@/assets/icons/importIcon.svg'
import teamIcon from '@/assets/icons/teamIcon.svg'
import downIcon from '@/assets/icons/downIcon.svg'
import teamIcon2 from '@/assets/icons/organize/teamIcon.svg'
import commonUseIcon from '@/assets/icons/commonUseIcon.svg'
import limitsIcon from '@/assets/icons/limitsIcon.svg'
import menuIcon from '@/assets/icons/menuIcon.svg'
import bookIcon2 from '@/assets/icons/team/bookIcon.svg'
import topicIcon from '@/assets/icons/team/topicIcon.svg'
import removeCommonIcon from '@/assets/icons/team/removeCommonIcon.svg'
import moreIcon2 from '@/assets/icons/moreIcon2.svg'
import deleteIcon2 from '@/assets/icons/deleteIcon.svg'
import reName from '@/assets/icons/bookSetting/reName.svg'
import renameIcon from '@/assets/icons/article/renameIcon.svg'
import pinOutIcon from '@/assets/icons/pinOutIcon.svg'
import editIcon from '@/assets/icons/article/editIcon.svg'
import directoryManager from '@/assets/icons/bookSetting/directoryManager.svg'
import groupIcon from '@/assets/icons/groupIcon.svg'
import renameIcon2 from '@/assets/icons/renameIcon.svg'
import copyLinkIcon from '@/assets/icons/article/copyLinkIcon.svg'
import copyIcon from '@/assets/icons/article/copyIcon.svg'
import moveIcon from '@/assets/icons/article/moveIcon.svg'
import exportIcon from '@/assets/icons/article/exportIcon.svg'
import addTabIcon from '@/assets/icons/article/addTabIcon.svg'
import editIcon2 from '@/assets/icons/team/editIcon.svg'
import linkIcon from '@/assets/icons/linkIcon.svg'
import uploadFile from '@/assets/icons/uploadFile.svg'
import edit from '@/assets/icons/bookSetting/edit.svg'
import settingIcon from '@/assets/icons/team/settingIcon.svg'
import reminderFreeIcon from '@/assets/icons/team/reminderFreeIcon.svg'
import publicIcon from '@/assets/icons/publicIcon.svg'
import statisticsIcon from '@/assets/icons/statistics.svg'

export const menuItemsData = [
  { type: 'item', icon: documentIcon, label: '文档', nick: 'toAddDoc' },
  { type: 'item', icon: formIcon, label: '表格', nick: 'toAddSheet' },
  { type: 'item', icon: mindmapIcon, label: '脑图', nick: 'toAddMindmap' },
  { type: 'item', icon: pptIcon, label: '幻灯片', nick: 'toAddPPT' },
  { type: 'divider' },
  { type: 'item', icon: bookIcon, label: '知识库' },
  { type: 'divider' },
  { type: 'item', icon: templateIcon, label: '从模板新建', nick: 'toImportTem' },
  { type: 'item', icon: importIcon, label: '导入...', nick: 'toImportFile' }
]

export const spaceMenuItemsData = [
  { type: 'item', icon: documentIcon, label: '文档', nick: 'toAddDoc' },
  { type: 'item', icon: formIcon, label: '表格', nick: 'toAddSheet' },
  { type: 'item', icon: mindmapIcon, label: '脑图', nick: 'toAddMindmap' },
  { type: 'item', icon: pptIcon, label: '幻灯片', nick: 'toAddPPT' },
  { type: 'divider' },
  { type: 'item', icon: bookIcon, label: '知识库', nick: 'toAddBook' },
  { type: 'item', icon: teamIcon, label: '团队', nick: 'toAddTeam' },
  { type: 'divider' },
  { type: 'item', icon: templateIcon, label: '从模板新建', nick: 'toImportTem' },
  { type: 'item', icon: importIcon, label: '导入...', nick: 'toImportFile' }
]

export const sidebarSearchMenuItemsData = [
  { type: 'item', icon: documentIcon, label: '文档', nick: 'toAddDoc' },
  { type: 'item', icon: formIcon, label: '表格', nick: 'toAddSheet' },
  { type: 'item', icon: mindmapIcon, label: '脑图', nick: 'toAddMindmap' },
  { type: 'item', icon: pptIcon, label: '幻灯片', nick: 'toAddPPT' },
  { type: 'divider' },
  { type: 'item', icon: templateIcon, label: '从模板新建', nick: 'toImportTem' },
  { type: 'item', icon: importIcon, label: '导入...', nick: 'toImportFile' },
  { type: 'divider' },
  { type: 'item', icon: groupIcon, label: '新建分组', nick: 'toAddGroup' },
  { type: 'item', icon: linkIcon, label: '添加链接', nick: 'toAddLink' },
  { type: 'item', icon: uploadFile, label: '上传文件', nick: 'toUpload' }
]

export const folderMenuItemsData = [
  { type: 'item', icon: documentIcon, label: '文档', nick: 'toAddDoc' },
  { type: 'item', icon: formIcon, label: '表格', nick: 'toAddSheet' },
  { type: 'item', icon: mindmapIcon, label: '脑图', nick: 'toAddMindmap' },
  { type: 'item', icon: pptIcon, label: '幻灯片', nick: 'toAddPPT' },
  { type: 'divider' },
  { type: 'item', icon: templateIcon, label: '从模板新建', nick: 'toImportTem' },
  { type: 'item', icon: importIcon, label: '导入...', nick: 'toImportFile' },
  { type: 'divider' },
  { type: 'item', icon: groupIcon, label: '新建分组', nick: 'toAddGroup' },
  { type: 'item', icon: linkIcon, label: '添加链接', nick: 'toAddLink' }
]

export const moduleAddMenuData = [
  { type: 'item', icon: documentIcon, label: '新建文档', nick: 'toAddDoc' },
  { type: 'item', icon: formIcon, label: '新建表格', nick: 'toAddSheet' },
  { type: 'item', icon: mindmapIcon, label: '新建脑图', nick: 'toAddMindmap' },
  { type: 'item', icon: pptIcon, label: '新建幻灯片', nick: 'toAddPPT' },
  { type: 'divider' },
  { type: 'item', icon: importIcon, label: '导入...', nick: 'toImportFile' }
]

export const libraryOperationData = [
  { type: 'item', icon: commonUseIcon, label: '移除常用', nick: 'toRemoveCommon' },
  { type: 'divider' },
  { type: 'item', icon: limitsIcon, label: '权限', nick: 'toPermission' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteLibrary' }
]

export const teamOperationData = [
  { type: 'item', icon: bookIcon2, label: '知识库', nick: 'toBook' },
  { type: 'item', icon: topicIcon, label: '话题', nick: 'toTopic' },
  { type: 'divider' },
  { type: 'item', icon: removeCommonIcon, label: '移除常用', nick: 'toRemoveCommon' },
  { type: 'item', icon: reminderFreeIcon, label: '动态免提醒', nick: 'toReminderFree' },
  { type: 'divider' },
  { type: 'item', icon: settingIcon, label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: editIcon2, label: '退出团队', nick: 'toQuitTeam' }
]

export const directoryIndexOperationData = [
  { type: 'item', icon: reName, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: edit, label: '编辑首页', nick: 'toEditIndex' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteBook' }
]

export const directorySidebarOperationData = [
  { type: 'item', icon: limitsIcon, label: '权限', nick: 'toPermission' },
  { type: 'item', icon: directoryManager, label: '目录管理', nick: 'toDirManage' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' }
]

export const moreOperationData = [
  { type: 'detailItem', icon: deleteIcon2, label: '回收站', desc: '找回删除的文档与内容', nick: 'toRecycle' },
  { type: 'divider' },
  { type: 'item', icon: menuIcon, label: '空间集合', nick: 'toShowAllSpace' },
  { type: 'item', icon: limitsIcon, label: '产品计划与更新日志' },
  { type: 'item', icon: menuIcon, label: '帮助' }
]

export const commonLibraryData = [
  { type: 'item', icon: commonUseIcon, label: '移除常用', nick: 'removeCommon' },
  { type: 'divider' },
  { type: 'item', icon: limitsIcon, label: '权限', nick: 'toPermission' },
  { type: 'item', icon: renameIcon2, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'deleteLibrary' }
]

export const notCommonLibraryData = [
  { type: 'item', icon: pinOutIcon, label: '常用', nick: 'addCommon' },
  { type: 'divider' },
  { type: 'item', icon: limitsIcon, label: '权限', nick: 'toPermission' },
  { type: 'item', icon: renameIcon2, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'deleteLibrary' }
]

export const articleOperationData = [
  { type: 'item', icon: renameIcon, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: editIcon, label: '编辑文档', nick: 'toEditArticle' },
  { type: 'item', icon: copyLinkIcon, label: '复制链接', nick: 'toCopyLink' },
  { type: 'item', icon: addTabIcon, label: '在新标签页打开', nick: 'toNewTab' },
  { type: 'divider' },
  // { type: 'item', icon: limitsIcon, label: '移除目录', nick: 'toTodo' },
  // { type: 'divider' },
  { type: 'item', icon: copyIcon, label: '复制', nick: 'toCopyArticle' },
  { type: 'item', icon: moveIcon, label: '移动', nick: 'toMoveArticle' },
  { type: 'item', icon: exportIcon, label: '导出', nick: 'toExport' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteArticle' }
]

export const linkOperationData = [
  { type: 'item', icon: editIcon, label: '修改链接信息', nick: 'toEditLink' },
  { type: 'item', icon: copyLinkIcon, label: '复制链接', nick: 'toCopyLink' },
  { type: 'divider' },
  // { type: 'item', icon: limitsIcon, label: '移除目录', nick: 'toTodo' },
  // { type: 'divider' },
  { type: 'item', icon: copyIcon, label: '复制', nick: 'toCopyArticle' },
  { type: 'item', icon: moveIcon, label: '移动', nick: 'toMoveArticle' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteArticle' }
]

export const titleOperationData = [
  { type: 'item', icon: renameIcon, label: '重命名', nick: 'toRename' },
  { type: 'divider' },
  // { type: 'item', icon: limitsIcon, label: '移除目录', nick: 'toTodo' },
  // { type: 'divider' },
  { type: 'item', icon: copyIcon, label: '复制', nick: 'toCopyArticle' },
  { type: 'item', icon: moveIcon, label: '移动', nick: 'toMoveArticle' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteArticle' }
]

export const fileOperationData = [
  { type: 'item', icon: renameIcon, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: copyLinkIcon, label: '复制链接', nick: 'toCopyLink' },
  { type: 'item', icon: addTabIcon, label: '在新标签页打开', nick: 'toNewTab' },
  { type: 'divider' },
  // { type: 'item', icon: limitsIcon, label: '移除目录', nick: 'toTodo' },
  // { type: 'divider' },
  { type: 'item', icon: copyIcon, label: '复制', nick: 'toCopyArticle' },
  { type: 'item', icon: moveIcon, label: '移动', nick: 'toMoveArticle' },
  { type: 'item', icon: exportIcon, label: '下载', nick: 'toDownload' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon2, label: '删除', nick: 'toDeleteArticle' }
]

export const importFileType = [
  {
    icon: 'https://gw.alipayobjects.com/zos/basement_prod/408f32c8-8385-4562-b037-c35ea82d2563.svg',
    title: 'Word',
    tips: '.docx .doc',
    accept: '.docx,.doc',
    type: 'word'
  },
  {
    icon: 'https://gw.alipayobjects.com/zos/basement_prod/5fdf1f7c-4a2f-4bd0-9d6b-6803b8bb86b6.svg',
    title: 'Excel',
    tips: '.xlsx',
    accept: '.xlsx',
    type: 'sheet'
  },
  {
    icon: 'https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*LWh4QLOft30AAAAAAAAAAAAAARQnAQ',
    title: '脑图',
    tips: '.xmind',
    accept: '.xmind',
    type: 'mind'
  },
  {
    icon: 'https://gw.alipayobjects.com/zos/bmw-prod/7a6c8901-3f7a-4deb-bd9f-b1d5fe138898.svg',
    title: 'PPT',
    tips: '.pptx .ppt',
    accept: '.pptx,.ppt',
    type: 'ppt'
  }
]

export const cooperateLink =
  'https://www.yuque.com/g/huangyuany/acb0b7/qbkoa01e902gmggk/collaborator/join?token=nx2jY3PCgd0MuLxP&source=doc_collaborator&goto=%2Fhuangyuany%2Facb0b7%2Fqbkoa01e902gmggk%2Fedit# 邀请你共同编辑表格《无标题表格》'

export const moduleData = [
  {
    id: 1,
    icon: docModuleIcon,
    title: '新建文档',
    description: '文档、表格、脑图、数据表',
    rightIcon: downIcon
  },
  {
    id: 2,
    icon: bookModuleIcon,
    title: '新建知识库',
    description: '使用知识库整理知识'
  },
  {
    id: 3,
    icon: temeplateModuleIcon,
    title: '模板中心',
    description: '从模板中获取灵感'
  }
]

export const moreMenuItemsData = [{ icon: moreIcon2, label: '更多' }]

export const contentItemsData = [
  {
    title: '知识库',
    type: 'library',
    icon: bookIcon,
    typeIcon: publicIcon,
    emptyText: '暂无常用知识库',
    isExpand: true,
    libraryList: []
  }
]

export const organizeMenu = [
  {
    id: 1,
    title: '空间总览',
    icon: spaceIcon,
    url: '/dashboard',
    nick: 'dashboard',
    children: []
  },
  {
    id: 2,
    title: '人员与权限',
    icon: memberIcon,
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
    icon: teamIcon2,
    url: '/teamManage',
    nick: 'teamManage',
    children: []
  },
  {
    id: 4,
    title: '空间设置',
    icon: setIcon,
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
    title: '统计',
    icon: statisticsIcon,
    url: '/statistics',
    nick: 'statistics',
    children: []
  },
  {
    id: 6,
    title: '回收站',
    icon: deleteIcon,
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

export const contentType = ref({
  title: folderIcon,
  doc: documentIcon,
  sheet: formIcon,
  mind: mindmapIcon,
  ppt: pptIcon,
  file: fileIcon
})

export const contentTypeName = ref({
  title: '分组',
  doc: '文档',
  sheet: '表格',
  mind: '脑图',
  ppt: '幻灯片',
  file: '文件'
})

export const docTypeName = [
  { label: '所有', value: '', type: 'item', nick: 'toSearchDoc' },
  { label: '文档', value: 'doc', type: 'item', nick: 'toSearchDoc' },
  { label: '表格', value: 'sheet', type: 'item', nick: 'toSearchDoc' },
  { label: '脑图', value: 'mind', type: 'item', nick: 'toSearchDoc' },
  { label: '幻灯片', value: 'ppt', type: 'item', nick: 'toSearchDoc' },
  { label: '文件', value: 'file', type: 'item', nick: 'toSearchDoc' }
]

export const rangeList = [
  { label: '全部', value: '0', type: 'item', nick: 'toSearchByRange' },
  { label: '近三十天', value: '30', type: 'item', nick: 'toSearchByRange' },
  { label: '一年', value: '365', type: 'item', nick: 'toSearchByRange' }
]

export const pluginList = {
  doc: {
    pluginkey: 'tinymce',
    pluginver: '6.7.3'
  },
  sheet: {
    pluginkey: 'luckysheet',
    pluginver: '2.1.13'
  },
  mind: {
    pluginkey: 'simple-mind-map',
    pluginver: '0.9.0'
  },
  ppt: {
    pluginkey: 'pptist',
    pluginver: '0.0.1'
  }
}

export const avatar = ref(
  (JSON.parse(localStorage.getItem('xinAn-userInfo')) && 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('xinAn-userInfo')).avatar) || '@/assets/img/img.jpg'
)
export const nickname = (JSON.parse(localStorage.getItem('xinAn-userInfo')) && JSON.parse(localStorage.getItem('xinAn-userInfo')).nickname) || ''

export const user = (JSON.parse(localStorage.getItem('xinAn-userInfo')) && JSON.parse(localStorage.getItem('xinAn-userInfo')).username) || ''

export const alphanumericRegex = /^[0-9a-zA-Z]+$/

export const environmentPrefix = {
  development: '/',
  staging: '/netKmp/',
  55: '/knowledge/'
}

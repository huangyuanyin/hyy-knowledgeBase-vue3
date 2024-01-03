import { ArticleInfo } from '@/type/article'
interface SpaceInfo {
  id: number
  spacename: string
  spacekey: string
  spacetype: string
  icon: string
  description: string
  creator: string
  members: any[]
}

interface BookInfo {
  id: number
  name: string
  icon: string
  group_icon: string
  slug: string
  public: string
  marked: boolean
  mark_id: number
  tag_mark: string
  body: string
  space: number
  group: number
  stacks: number
  creator: string
}

export const useInfoStore = defineStore('info', () => {
  const personalSpaceId = ref(JSON.parse(localStorage.getItem('personalSpaceId')) || null)
  const currentSidebar = ref<string>(sessionStorage.getItem('xinAn-sidebar') || '') // 当前侧边栏类型
  const currentSpaceType = ref<string>('') // 当前空间类型
  const currentTeamInfo = ref(JSON.parse(sessionStorage.getItem('xinAn-teamInfo') || '{}')) // 当前团队信息
  const currentSpaceInfo = ref<SpaceInfo>(JSON.parse(sessionStorage.getItem('xinAn-spaceInfo') || '{}')) // 当前空间信息
  const currentBookInfo = ref<BookInfo>(JSON.parse(sessionStorage.getItem('xinAn-bookInfo') || '{}')) // 当前知识库信息
  const currentArticleTreeInfo = ref<ArticleInfo[]>(null) // 当前知识库目录列表
  const currentArticleInfo = ref<ArticleInfo | string>() // 当前文章信息
  const isSpaceAdmin = ref<string>(sessionStorage.getItem('xinAn-spaceAdmin')) // 是否是当前空间管理员
  const currentMenu = ref<string>('') // 当前菜单名称

  const setPersonalSpaceId = (val: number) => {
    personalSpaceId.value = val
    localStorage.setItem('personalSpaceId', JSON.stringify(val))
  }

  const setCurrentSidebar = (val: string) => {
    currentSidebar.value = val
    sessionStorage.setItem('xinAn-sidebar', val)
  }

  const setCurrentSpaceType = (val: string) => {
    currentSpaceType.value = val
  }

  const setCurrentTeamInfo = (val: any) => {
    currentTeamInfo.value = val
    sessionStorage.setItem('xinAn-teamInfo', JSON.stringify(val))
  }

  const setCurrentSpaceInfo = (val: SpaceInfo) => {
    currentSpaceInfo.value = val
    sessionStorage.setItem('xinAn-spaceInfo', JSON.stringify(val))
  }

  const setCurrentBookInfo = (val: any) => {
    currentBookInfo.value = val
    sessionStorage.setItem('xinAn-bookInfo', JSON.stringify(val))
  }

  const setCurrentArticleTreeInfo = (val: ArticleInfo[]) => {
    currentArticleTreeInfo.value = val
  }

  const setCurrentArticleInfo = (val: ArticleInfo | string) => {
    currentArticleInfo.value = val
  }

  const setIsSpaceAdmin = (val: string) => {
    isSpaceAdmin.value = val
    sessionStorage.setItem('xinAn-spaceAdmin', val)
  }

  const setCurrentMenu = (val: string) => {
    currentMenu.value = val
  }

  return {
    personalSpaceId,
    setPersonalSpaceId,

    currentSidebar,
    setCurrentSidebar,

    currentSpaceType,
    setCurrentSpaceType,

    currentTeamInfo,
    setCurrentTeamInfo,

    currentMenu,
    setCurrentMenu,

    currentSpaceInfo,
    setCurrentSpaceInfo,

    currentBookInfo,
    setCurrentBookInfo,

    currentArticleTreeInfo,
    setCurrentArticleTreeInfo,

    currentArticleInfo,
    setCurrentArticleInfo,

    isSpaceAdmin,
    setIsSpaceAdmin
  }
})

export const useRefreshStore = defineStore('refresh', () => {
  const isRefreshQuickBookList = ref(false) // 刷新常用列表（知识库）
  const isRefreshQuickTeamList = ref(false) // 刷新常用列表（团队）
  const isRefreshBookStacks = ref(false) // 刷新知识库分组列表
  const isRefreshPublicBookStacks = ref(false) // 刷新知识库分组列表 =》 公共区
  const isRefreshBookList = ref(false) // 刷新知识库列表
  const isRefreshSpaceMember = ref(false) // 刷新空间成员
  const isRefreshTeamMember = ref(false) // 刷新团队成员
  const isRefreshArticleList = ref(false) // 刷新文章列表
  const isRefreshBookSet = ref(false) // 刷新知识库设置
  const isRefreshTeamSet = ref(false) // 刷新团队设置
  const isRefreshSpaceSet = ref(false) // 刷新空间设置
  const isRefreshMind = ref(false) // 刷新思维导图

  const setRefreshBookStacks = (val: boolean) => {
    isRefreshBookStacks.value = val
  }

  const setRefreshPublicBookStacks = (val: boolean) => {
    isRefreshPublicBookStacks.value = val
  }

  const setRefreshQuickBookList = (val: boolean) => {
    isRefreshQuickBookList.value = val
  }

  const setRefreshQuickTeamList = (val: boolean) => {
    isRefreshQuickTeamList.value = val
  }

  const setRefreshSpaceMember = (val: boolean) => {
    isRefreshSpaceMember.value = val
  }

  const setRefreshTeamMember = (val: boolean) => {
    isRefreshTeamMember.value = val
  }

  const setRefreshBookList = (val: boolean) => {
    isRefreshBookList.value = val
  }

  const setRefreshArticleList = (val: boolean) => {
    isRefreshArticleList.value = val
  }

  const setRefreshBookSet = (val: boolean) => {
    isRefreshBookSet.value = val
  }

  const setRefreshTeamSet = (val: boolean) => {
    isRefreshTeamSet.value = val
  }

  const setRefreshSpaceSet = (val: boolean) => {
    isRefreshSpaceSet.value = val
  }

  const setRefreshMind = (val: boolean) => {
    isRefreshMind.value = val
  }

  return {
    isRefreshBookStacks,
    setRefreshBookStacks,
    isRefreshPublicBookStacks,
    setRefreshPublicBookStacks,
    isRefreshQuickBookList,
    setRefreshQuickBookList,
    isRefreshQuickTeamList,
    setRefreshQuickTeamList,
    isRefreshSpaceMember,
    setRefreshSpaceMember,
    isRefreshTeamMember,
    setRefreshTeamMember,
    isRefreshBookList,
    setRefreshBookList,
    isRefreshArticleList,
    setRefreshArticleList,
    isRefreshBookSet,
    setRefreshBookSet,
    isRefreshTeamSet,
    setRefreshTeamSet,
    isRefreshSpaceSet,
    setRefreshSpaceSet,
    isRefreshMind,
    setRefreshMind
  }
})

export const useRefreshStore = defineStore('refresh', () => {
  const isRefreshQuickBookList = ref(false) // 刷新常用列表（知识库）
  const isRefreshQuickTeamList = ref(false) // 刷新常用列表（团队）
  const isRefreshBookStacks = ref(false) // 刷新知识库分组列表
  const isRefreshBookList = ref(false) // 刷新知识库列表
  const isRefreshSpaceMember = ref(false) // 刷新空间成员
  const isRefreshTeamMember = ref(false) // 刷新团队成员

  const setRefreshBookStacks = (val: boolean) => {
    isRefreshBookStacks.value = val
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

  return {
    isRefreshBookStacks,
    setRefreshBookStacks,
    isRefreshQuickBookList,
    setRefreshQuickBookList,
    isRefreshQuickTeamList,
    setRefreshQuickTeamList,
    isRefreshSpaceMember,
    setRefreshSpaceMember,
    isRefreshTeamMember,
    setRefreshTeamMember,
    isRefreshBookList,
    setRefreshBookList
  }
})

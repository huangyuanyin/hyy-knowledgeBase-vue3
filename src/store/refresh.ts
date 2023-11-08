export const useRefreshStore = defineStore('refresh', () => {
  const isGetBookStacks = ref<Boolean>(false)
  const isGetLibrary = ref<Boolean>(false)
  const isGetQuickList = ref(false)
  const isGetTeamQuickList = ref(false)
  const isRefreshSpaceMember = ref(false) // 刷新空间成员
  const isRefreshTeamMember = ref(false) // 刷新团队成员
  const isRefreshBookList = ref(false) // 刷新书单列表

  const setIsGetBookStacks = (val: boolean) => {
    isGetBookStacks.value = val
  }

  const setIsGetLibrary = (val: boolean) => {
    isGetLibrary.value = val
  }

  const setIsGetQuickList = (val: boolean) => {
    isGetQuickList.value = val
  }

  const setIsGetTeamQuickList = (val: boolean) => {
    isGetTeamQuickList.value = val
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
    isGetBookStacks,
    setIsGetBookStacks,
    isGetLibrary,
    setIsGetLibrary,
    isGetQuickList,
    setIsGetQuickList,
    isGetTeamQuickList,
    setIsGetTeamQuickList,
    isRefreshSpaceMember,
    setRefreshSpaceMember,
    isRefreshTeamMember,
    setRefreshTeamMember,
    isRefreshBookList,
    setRefreshBookList
  }
})

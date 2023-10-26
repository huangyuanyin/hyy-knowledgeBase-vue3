export const useRefreshStore = defineStore('refresh', () => {
  const isGetBookStacks = ref<Boolean>(false)
  const isGetLibrary = ref<Boolean>(false)
  const isGetQuickList = ref(false)
  const isGetTeamQuickList = ref(false)
  const isRefreshSpaceMember = ref(false) // 刷新空间成员

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
    setRefreshSpaceMember
  }
})

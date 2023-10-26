export const useDataStore = defineStore('data', () => {
  const commonLibraryList = ref([]) // 常用知识库列表
  const teamList = ref([]) // 当前空间下的团队列表

  const setCommonLibraryList = (val) => {
    commonLibraryList.value = val
  }

  const setTeamList = (val) => {
    teamList.value = val
  }

  return {
    commonLibraryList,
    setCommonLibraryList,
    teamList,
    setTeamList
  }
})

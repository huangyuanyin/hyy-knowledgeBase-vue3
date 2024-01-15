export const useListStore = defineStore('list', () => {
  const commonBookList = ref<Array<any>>([]) // 常用知识库列表
  const commonTeamList = ref<Array<any>>([]) // 常用团队列表
  const tageList = ref<Array<any>>([]) // 标签列表

  const setCommonBookList = (val: any) => {
    commonBookList.value = val
  }

  const setCommonTeamList = (val: any) => {
    commonTeamList.value = val
  }

  const setTageList = (val: any) => {
    tageList.value = val
  }

  return {
    commonBookList,
    commonTeamList,
    setCommonBookList,
    setCommonTeamList,
    tageList,
    setTageList
  }
})

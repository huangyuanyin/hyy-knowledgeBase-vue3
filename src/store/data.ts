import { mindMapInitData, pptInitData } from '@/data/initData'

export const useDataStore = defineStore('data', () => {
  const commonLibraryList = ref([]) // 常用知识库列表
  const teamList = ref([]) // 当前空间下的团队列表
  const mindMapData = ref(JSON.stringify(mindMapInitData)) // 脑图数据
  const pptData = ref(JSON.stringify(pptInitData))

  const setCommonLibraryList = (val) => {
    commonLibraryList.value = val
  }

  const setTeamList = (val) => {
    teamList.value = val
  }

  const setMindMap = (val) => {
    mindMapData.value = val
  }

  return {
    commonLibraryList,
    setCommonLibraryList,
    teamList,
    setTeamList,
    mindMapData,
    setMindMap,
    pptData
  }
})

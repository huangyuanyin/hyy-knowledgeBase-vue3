import { mindMapInitData } from '@/data/initData'

export const useDataStore = defineStore('data', () => {
  const commonLibraryList = ref([]) // 常用知识库列表
  const teamList = ref([]) // 当前空间下的团队列表
  const mindMapData = ref(JSON.stringify(mindMapInitData)) // 脑图数据

  const setCommonLibraryList = (val) => {
    commonLibraryList.value = val
  }

  const setTeamList = (val) => {
    teamList.value = val
  }

  const setMindMap = (val) => {
    mindMapData.value = val
    sessionStorage.setItem('xinAn-mindMap', JSON.stringify(val))
  }

  return {
    commonLibraryList,
    setCommonLibraryList,
    teamList,
    setTeamList,
    mindMapData,
    setMindMap
  }
})

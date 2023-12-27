export interface SidebarInfo {
  nickname: string
  name: string
  id: number
}

export const useInfoStore = defineStore('info', () => {
  const personalSpaceId = ref(JSON.parse(localStorage.getItem('personalSpaceId')) || null)
  const currentSidebar = ref(sessionStorage.getItem('currentSidebar') || '') // 当前侧边栏类型
  const currentSpaceType = ref('') // 当前空间类型
  const currentTeamInfo = ref(JSON.parse(sessionStorage.getItem('xinAn-teamInfo') || '{}')) // 当前团队信息
  const currentMenu = ref('')
  const currentSpaceName = ref('')
  const currentSpaceInfo = ref<SidebarInfo>({
    nickname: '',
    name: '',
    id: 0
  })

  const setPersonalSpaceId = (val: number) => {
    personalSpaceId.value = val
    localStorage.setItem('personalSpaceId', JSON.stringify(personalSpaceId.value))
  }

  const setCurrentMenu = (val: string) => {
    currentMenu.value = val
  }

  const setCurrentSidebar = (val: string) => {
    currentSidebar.value = val
    sessionStorage.setItem('currentSidebar', currentSidebar.value)
  }

  const setCurrentSpaceType = (val: string) => {
    currentSpaceType.value = val
  }

  const setCurrentTeamInfo = (val: any) => {
    currentTeamInfo.value = val
    sessionStorage.setItem('xinAn-teamInfo', JSON.stringify(currentTeamInfo.value))
  }

  const setCurrentSpaceName = (val: string) => {
    currentSpaceName.value = val
  }

  const setCurrentSpaceInfo = (val: SidebarInfo) => {
    currentSpaceInfo.value = val
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

    currentSpaceName,
    setCurrentSpaceName,

    currentSpaceInfo,
    setCurrentSpaceInfo
  }
})

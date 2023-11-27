export interface SidebarInfo {
  nickname: string
  name: string
  id: number
}

export const useInfoStore = defineStore('info', () => {
  const personalSpaceId = ref(JSON.parse(localStorage.getItem('personalSpaceId')) || null)
  const currentSidebar = ref(sessionStorage.getItem('currentSidebar') || '')
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

    currentMenu,
    setCurrentMenu,

    currentSpaceName,
    setCurrentSpaceName,

    currentSpaceInfo,
    setCurrentSpaceInfo
  }
})

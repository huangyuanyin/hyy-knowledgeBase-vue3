export interface SidebarInfo {
  nickname: string
  name: string
  id: number
  icon: string
}

export const useInfoStore = defineStore('info', () => {
  const currentSidebar = ref('')
  const currentMenu = ref('')
  const currentSpaceName = ref('')
  const currentSpaceInfo = ref<SidebarInfo>({
    nickname: '',
    name: '',
    id: 0,
    icon: ''
  })

  const setCurrentMenu = (val: string) => {
    currentMenu.value = val
  }

  const setCurrentSidebar = (val: string) => {
    currentSidebar.value = val
  }

  const setCurrentSpaceName = (val: string) => {
    currentSpaceName.value = val
  }

  const setCurrentSpaceInfo = (val: SidebarInfo) => {
    currentSpaceInfo.value = val
  }

  return {
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

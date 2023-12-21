import Vrouter from '@/router'

export const useData = () => {
  const route = Vrouter.currentRoute.value
  const user = ref<string>('')
  const space = ref<string>('')
  const spaceType = ref<string>('')
  const spaceName = ref<string>('')

  function setSpaceAndType(value: string, type: string) {
    space.value = value
    spaceType.value = type
    spaceName.value = spaceType.value === '个人' ? '' : route.path.split('/')[1]
  }

  function handleData(setSpaceAndType: (value: string, type: string) => void, personalSpaceInfo: any) {
    switch (route.meta.asideComponent) {
      case 'SpaceSidebar':
        setSpaceAndType(route.query.sid as string, '组织')
        break
      case 'Sidebar':
        setSpaceAndType(personalSpaceInfo.id, '个人')
        break
      case 'DirectorySidebar':
        if (route.path.split('/')[1] === 'directory') {
          setSpaceAndType(personalSpaceInfo.id, '个人')
        } else {
          setSpaceAndType(route.query.sid as string, '组织')
        }
        break
    }
  }

  watch(
    () => route.fullPath,
    () => {
      user.value = (JSON.parse(localStorage.getItem('userInfo')) || {}).username || ''

      const personalSpaceInfo = JSON.parse(localStorage.getItem('personalSpaceInfo'))

      handleData(setSpaceAndType, personalSpaceInfo)
    },
    {
      immediate: true
    }
  )

  return { user, space, spaceType, spaceName }
}

import Vrouter from '@/router'
import documentIcon from '@/assets/icons/documentIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'
import fileIcon from '@/assets/icons/uploadFile.svg'

const contentType = {
  doc: documentIcon,
  sheet: formIcon,
  mind: mindmapIcon,
  ppt: pptIcon,
  file: fileIcon
}

export const useData = () => {
  const route = Vrouter.currentRoute.value
  const infoStore = useInfoStore()
  const user = ref<string>('')
  const space = ref<string>('')
  const spaceName = ref<string>('')
  const spaceIcon = ref<string>('')

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

  /**
   *
   * @param value  空间id
   * @param type 空间类型
   */
  function setSpaceAndType(value: string, type: string) {
    space.value = value
    spaceName.value = infoStore.currentSpaceType === '个人' ? '' : route.path.split('/')[1]
    spaceIcon.value =
      infoStore.currentSpaceType === '个人'
        ? 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar
        : JSON.parse(sessionStorage.getItem('currentSpaceInfo')).icon || ''
  }

  /**
   *
   * @param setSpaceAndType 设置空间id和类型
   * @param personalSpaceInfo 个人空间信息
   */
  function handleData(setSpaceAndType: (value: string | object, type: string) => void, personalSpaceInfo: any) {
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

  /**
   *
   * @param type 文章类型
   * @returns 文章类型对应的图标
   */
  function judegeArticleType(type: string): string | undefined {
    return contentType[type]
  }

  return { user, space, spaceName, spaceIcon, judegeArticleType }
}

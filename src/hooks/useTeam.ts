import Vrouter from '@/router'
import { getGroupsApi } from '@/api/groups'

export const useTeam = () => {
  const route = Vrouter.currentRoute.value
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const space = ref<string>('')
  const spaceType = ref<string>('')
  const teamList = ref<Array<any>>([])

  watch(
    () => route.fullPath,
    () => {
      const setSpaceAndType = (value: string, type: string) => {
        space.value = value
        spaceType.value = type
      }
      const personalSpaceInfo = JSON.parse(localStorage.getItem('personalSpaceInfo'))
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
    },
    {
      immediate: true
    }
  )

  /**
   * 获取团队列表
   * @param {string} sid 空间id
   */
  const getTeamList = async (sid?: string) => {
    const params = {
      space: sid || space.value,
      permusername: user
    }
    let res = await getGroupsApi(params)
    if (res.code === 1000) {
      teamList.value = res.data as any
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { teamList, getTeamList }
}

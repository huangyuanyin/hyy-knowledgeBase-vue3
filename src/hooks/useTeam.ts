import Vrouter from '@/router'
import { editGroupsApi, getGroupsApi } from '@/api/groups'

interface CallbackFunction {
  (success: boolean): void
}

export const useTeam = () => {
  const route = Vrouter.currentRoute.value
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const space = ref<string>('')
  const spaceType = ref<string>('')
  const spaceName = ref<string>('')
  const teamList = ref<Array<any>>([])

  const { space: sid, spaceType: stype, spaceName: sname } = useData()
  space.value = sid.value
  spaceType.value = stype.value
  spaceName.value = sname.value

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

  /**
   * 编辑团队
   * @param {number} id 团队id
   * @param {object} params 团队信息
   * @param {function} callback 回调函数
   */
  const editTeam = async (id, params, callback: CallbackFunction) => {
    let res = await editGroupsApi(params, id)
    if (res.code === 1000) {
      await callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { teamList, getTeamList, editTeam }
}

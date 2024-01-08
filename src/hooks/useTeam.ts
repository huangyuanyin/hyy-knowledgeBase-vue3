import Vrouter from '@/router'
import { editGroupsApi, getGroupsApi, getGroupsDetailApi } from '@/api/groups'
import { isDefaultType } from '@/type/type'

interface CallbackFunction {
  (success: boolean): void
}

interface TeamParams {
  space?: string
  is_default?: isDefaultType
}

export const useTeam = () => {
  const route = Vrouter.currentRoute.value
  const infoStore = useInfoStore()
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const space = ref<string>('')
  const spaceName = ref<string>('')
  const teamList = ref<Array<any>>([])

  const { space: sid, spaceName: sname } = useData()
  space.value = sid.value
  spaceName.value = sname.value

  /**
   * 获取团队详细信息
   * @param {number} id 团队id
   */
  const getTeamInfo = async (id: number, callback?: CallbackFunction) => {
    let res = await getGroupsDetailApi(id)
    if (res.code === 1000) {
      infoStore.setCurrentTeamInfo(res.data)
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取团队列表
   * @param {TeamParams} sparams 参数
   */
  const getTeamList = async (sparams?: TeamParams) => {
    let params = {
      space: space.value
    }
    sparams && (params = { ...params, ...sparams })
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
  const editTeam = async (id, params, callback?: CallbackFunction) => {
    let res = await editGroupsApi(params, id)
    if (res.code === 1000) {
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { teamList, getTeamInfo, getTeamList, editTeam }
}

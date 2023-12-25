import Vrouter from '@/router'
import { addMarksApi } from '@/api/marks'

interface CollectInfo {
  target_type: string
  target_id: string
  space: string
}

interface CallbackFunction {
  (success: object): void
}

export const useCollect = () => {
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
   * 添加收藏
   * @param {CollectInfo} params 收藏信息
   * @param {function} callback 回调函数
   */
  const addCollect = async (params: CollectInfo, callback: CallbackFunction) => {
    let res = await addMarksApi(params)
    if (res.code === 1000) {
      ElMessage.success('收藏成功')
      await callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { teamList, addCollect }
}

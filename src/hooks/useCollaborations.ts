import Vrouter from '@/router'
import { editCollaborationsApi } from '@/api/collaborations'

interface CallbackFunction {
  (success: object): void
}

interface BookCollaborationsInfo {
  space: string
  group: string
  book: string
  permtype: string // 1: 可管理 2: 可编辑 3: 可阅读
  permusername: string // 协作者用户名
}

export const useCollaborations = () => {
  const route = Vrouter.currentRoute.value
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const space = ref<string>('')
  const spaceName = ref<string>('')
  const teamList = ref<Array<any>>([])

  const { space: sid, spaceName: sname } = useData()
  space.value = sid.value
  spaceName.value = sname.value

  /**
   * 编辑知识库协作者
   * @param {number} id 协作者id
   * @param {BookCollaborationsInfo} params 知识库和协作者信息
   * @param {function} callback 回调函数
   */
  const editCollaborations = async (id, params: BookCollaborationsInfo, callback: CallbackFunction) => {
    let res = await editCollaborationsApi(id, params)
    if (res.code === 1000) {
      await callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { teamList, editCollaborations }
}

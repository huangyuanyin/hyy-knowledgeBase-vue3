import { getQuickLinksApi } from '@/api/quickLinks'
import { quickLinksData } from '@/api/quickLinks/type'
import { TargetType, Callback } from '@/type/type'

export const useCommon = () => {
  const commonBookList = ref<quickLinksData[]>([]) // 常用列表 - 知识库
  const commonTeamList = ref<quickLinksData[]>([]) // 常用列表 - 团队

  const { space: sid } = useData()

  /**
   * 获取常用列表 - 知识库、团队
   * @param {TargetType} target_type 目标类型
   * @param {Callback} callback 回调函数
   */
  const getCommonList = async (target_type: TargetType, callback?: Callback) => {
    const params = {
      space: sid.value,
      target_type
    }
    let res = await getQuickLinksApi(params)
    if (res.code === 1000) {
      target_type === 'book' ? (commonBookList.value = res.data || []) : (commonTeamList.value = res.data || [])
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    commonBookList,
    commonTeamList,
    getCommonList
  }
}

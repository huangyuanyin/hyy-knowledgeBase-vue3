import { getQuickLinksApi } from '@/api/quickLinks'
import { quickLinksData } from '@/api/quickLinks/type'
import { TargetType, Callback } from '@/type/type'

const listStore = useListStore()

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
      target_type === 'book'
        ? (commonBookList.value = res.data || []) && listStore.setCommonBookList(res.data)
        : (commonTeamList.value = res.data || []) && listStore.setCommonTeamList(res.data)
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 在列表中找出已添加常用的项
   * @param {TargetType} target_type 目标类型
   * @param {Array<any>} list 列表
   * @returns {Array<any>} 列表
   * @description 遍历列表和常用列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
   */
  function findCommonItem(target_type: TargetType, list: Array<any>) {
    const commonlist = target_type === 'book' ? commonBookList.value : commonTeamList.value
    list.forEach((item) => {
      item.is_common_id = null
      commonlist.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
    return list
  }

  return {
    commonBookList,
    commonTeamList,
    getCommonList,
    findCommonItem
  }
}

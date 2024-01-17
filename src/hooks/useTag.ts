import { Callback } from '@/type/type'
import { addTagApi, deleteTagApi, editTagApi, getTagApi } from '@/api/tag'

export const useTag = () => {
  const listStroe = useListStore()
  const infoStore = useInfoStore()
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const tagList = ref<Array<any>>([])

  /**
   * 获取标签列表
   * @param {Callback} callback 回调函数
   */
  const getTagList = async (callback?: Callback) => {
    const params = {
      space: infoStore.currentQuery?.sid,
      action_type: 'mark',
      creator: user
    }
    let res = await getTagApi(params)
    if (res.code === 1000) {
      tagList.value = res.data
      listStroe.setTageList(res.data)
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 添加标签
   * @param {string} name 标签名称
   * @param {Callback} callback 回调函数
   */
  const addTag = async (name: string, callback?: Callback) => {
    const params = {
      name,
      space: infoStore.currentQuery?.sid,
      action_type: 'mark'
    }
    let res = await addTagApi(params)
    if (res.code === 1000) {
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑标签
   * @param {number} tagId 标签id
   * @param {string} name 标签名称
   * @param {Callback} callback 回调函数
   */
  const editTag = async (tagId: number, name: string, callback?: Callback) => {
    const params = {
      name,
      space: infoStore.currentQuery?.sid,
      action_type: 'mark'
    }
    let res = await editTagApi(tagId, params)
    if (res.code === 1000) {
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 删除标签
   * @param {number} tagId 标签id
   * @param {Callback} callback 回调函数
   */
  const deleteTag = async (tagId: number, callback?: Callback) => {
    let res = await deleteTagApi(tagId)
    if (res.code === 1000) {
      ElMessage.success('删除成功')
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { tagList, getTagList, addTag, editTag, deleteTag }
}

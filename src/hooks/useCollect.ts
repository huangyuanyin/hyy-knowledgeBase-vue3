import { Callback } from '@/type/type'
import { addMarksApi, deleteMarksApi, editMarksApi, getMarksApi } from '@/api/marks'

interface CollectInfo {
  target_type?: string
  target_id: string
  tags_id?: string
  space?: string
}

export const useCollect = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
  const collectList = ref<Array<any>>([])

  /**
   * 获取收藏列表
   * @param {number} id 标签id
   * @param {Callback} callback 回调函数
   */
  const getCollectList = async (id?: number, callback?: Callback) => {
    const params = {
      tags_id: id,
      space: JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).id,
      creator: user
    }
    !id && delete params.tags_id
    let res = await getMarksApi(params)
    if (res.code === 1000) {
      collectList.value = res.data
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 添加收藏
   * @param {string} tid 标签ID
   * @param {string} type 收藏类型
   * @param {Callback} callback 回调函数
   */
  const addCollect = async (tid: string, callback?: Callback, type: string = 'book') => {
    const params = {
      target_type: type,
      target_id: tid,
      space: JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).id
    }
    let res = await addMarksApi(params)
    if (res.code === 1000) {
      ElMessage.success('收藏成功')
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑收藏
   * @param {number} id 收藏id
   * @param {CollectInfo} collectInfo 收藏信息
   * @param {Callback} callback 回调函数
   */
  const editCollect = async (id: number, collectInfo: CollectInfo, callback: Callback) => {
    const params = {
      space: JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).id,
      tags_id: collectInfo.tags_id,
      target_id: collectInfo.target_id,
      creator: user
    }
    let res = await editMarksApi(id, params)
    if (res.code === 1000) {
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 取消收藏
   * @param {number} id 收藏id
   * @param {Callback} callback 回调函数
   */
  const deleteCollect = async (id: number, callback: Callback) => {
    let res = await deleteMarksApi(id)
    if (res.code === 1000) {
      ElMessage.success('取消收藏')
      callback && callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { collectList, getCollectList, addCollect, editCollect, deleteCollect }
}

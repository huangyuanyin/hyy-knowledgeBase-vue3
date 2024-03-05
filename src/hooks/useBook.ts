import { editLibraryApi, getLibraryApi, getLibraryDetailApi } from '@/api/library'
import { useInfoStore } from '@/store/info'
import { user } from '@/data/data'

interface BookParams {
  space?: string
  group?: string
  stacks?: string
  permusername?: string
}

interface CallbackFunction {
  (success: object): void
}

export const useBook = () => {
  const infoStore = useInfoStore()
  const bookList = ref<Array<any>>([])
  const isHasPermission = ref<boolean>(false)

  /**
   * 获取知识库详情
   * @param {number} id 知识库id
   */
  const getBookInfo = async (id: number, callback?: CallbackFunction) => {
    if (infoStore.currentQuery?.type === 'share') return
    let res = await getLibraryDetailApi(id)
    if (res.code === 1000) {
      infoStore.setCurrentBookInfo(res.data)
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取知识库列表
   * @param {string | BookParams} group 团队id 或者 参数对象
   * @param {CallbackFunction} callback 回调函数
   */
  const getBookList = async (group: string | BookParams, callback?: CallbackFunction) => {
    let params: BookParams
    if (typeof group === 'string') {
      params = {
        group,
        permusername: user
      }
    } else {
      params = group
    }
    let res = await getLibraryApi(params)
    isHasPermission.value = res.code === 1100 ? false : true
    if (res.code === 1000) {
      bookList.value = res.data as any
      callback && (await callback(res))
    } else {
      res.code !== 1100 && ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑知识库
   * @param {number} id 知识库id
   * @param {object} params 知识库信息
   * @param {function} callback 回调函数
   */
  const editBook = async (id: number, params: object, callback: CallbackFunction) => {
    let res = await editLibraryApi(params, id)
    if (res.code === 1000) {
      callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    bookList,
    isHasPermission,
    getBookList,
    editBook,
    getBookInfo
  }
}

import { editLibraryApi, getLibraryApi } from '@/api/library'

interface BookParams {
  space?: string
  group?: string
  permusername: string
}

interface CallbackFunction {
  (success: object): void
}

export const useBook = () => {
  const user = (JSON.parse(localStorage.getItem('userInfo')) || {}).username || ''
  const bookList = ref<Array<any>>([])

  /**
   * 获取知识库列表
   * @param {string | BookParams} group 团队id 或者 参数对象
   */
  const getBookList = async (group: string | BookParams) => {
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
    if (res.code === 1000) {
      bookList.value = res.data as any
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑知识库
   * @param {number} id 知识库id
   * @param {object} params 知识库信息
   * @param {function} callback 回调函数
   */
  const editBook = async (id, params, callback: CallbackFunction) => {
    let res = await editLibraryApi(params, id)
    if (res.code === 1000) {
      callback(res.data)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return { bookList, getBookList, editBook }
}

import { getLibraryApi } from '@/api/library'

interface BookParams {
  space?: string
  group?: string
  permusername: string
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

  return { bookList, getBookList }
}

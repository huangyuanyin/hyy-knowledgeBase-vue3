import { getArticleTreeApi } from '@/api/article'

interface Article {
  id: number
  title: string
  type: string
  children: Article[]
  update_datetime: string
  creator: string
  modifier: string
  book: number
  space: number
}

export const useArticleStore = defineStore('article', () => {
  const articleList: Ref<Article[]> = ref([]) // 目录树

  const getArticleList = async (bookId) => {
    const res = await getArticleTreeApi(bookId)
    if (res.code === 1000) {
      articleList.value = res.data || ([] as any)
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    articleList,
    getArticleList
  }
})

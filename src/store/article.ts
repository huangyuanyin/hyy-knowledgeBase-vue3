// export const useArticleStore = defineStore('article', () => {
//   const articleTree = ref([])

//   const setArticleTree = (val: any) => {
//     console.log(`output->val`, val)
//     articleTree.value = val
//   }

//   return {
//     articleTree,
//     setArticleTree
//   }
// })

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
    const params = {
      book_id: bookId // 知识库id
    }
    const res = await getArticleTreeApi(params)
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

import { addLikeApi, deleteLikeApi } from '@/api/like'
import Vrouter from '@/router'
import { ArticleInfo } from '@/type/article'

export const useLike = () => {
  const route = Vrouter.currentRoute.value
  const infoStore = useInfoStore()
  const target_type = route.path.split('/').slice(-2)[0] // 获取文章类型

  /**
   * 处理点赞与取消点赞
   */
  const handleLike = async () => {
    const liked: boolean = (infoStore.currentArticleInfo as ArticleInfo)?.liked // 是否已经点赞
    const like_id: number = (infoStore.currentArticleInfo as ArticleInfo)?.like_id // 点赞id
    const aid = ref<string>(infoStore.currentQuery?.aid) // 文章id

    if (liked) {
      let res = await deleteLikeApi(like_id)
      if (res.code === 1000) {
        useArticle().getArticleDetail(Number(aid.value))
      } else {
        ElMessage.error(res.msg)
      }
    } else {
      const params = {
        space: infoStore.currentQuery?.sid,
        target_id: aid.value,
        target_type
      }
      let res = await addLikeApi(params)
      if (res.code === 1000) {
        useArticle().getArticleDetail(Number(aid.value))
      } else {
        ElMessage.error(res.msg)
      }
    }
  }

  return {
    handleLike
  }
}

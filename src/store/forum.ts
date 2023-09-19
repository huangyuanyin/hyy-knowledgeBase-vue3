import { getForumApi } from '@/api/forum'

interface ForumItem {
  id: number
  articleId: number
  label: string
  type: string
  children?: ForumItem[]
}

export const useForumStore = defineStore('forum', () => {
  const forumList: Ref<ForumItem[]> = ref([])

  async function getForum(params) {
    let { forumList: list, fetchForum } = useForumApi(getForumApi, params)
    await fetchForum()
    forumList.value = list.value
    return { forumList }
  }

  return { forumList, getForum }
})

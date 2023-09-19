export const useForumApi = (apiFunction, params) => {
  const forumList = ref([])

  const fetchForum = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        if (Array.isArray(res.data)) {
          forumList.value = res.data
        } else {
          console.error('Unexpected response data:', res.data)
        }
      }
    } catch (error) {
      // error
    }
  }

  return {
    forumList,
    fetchForum
  }
}

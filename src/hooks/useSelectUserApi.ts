export const useSelectUserApi = async (apiFunction, params, loading: boolean = true) => {
  const selectUserList = ref([])
  const isLoading = ref(loading)

  const fetchSelectUser = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        selectUserList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    await fetchSelectUser()
  }

  return {
    selectUserList,
    fetchSelectUser,
    isLoading
  }
}

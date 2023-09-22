export const useGroupsApi = async (apiFunction, params, loading: boolean = true) => {
  const groupsList = ref([])
  const isLoading = ref(loading)

  const getGroups = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        groupsList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    await getGroups()
  }

  return {
    groupsList,
    getGroups,
    isLoading
  }
}

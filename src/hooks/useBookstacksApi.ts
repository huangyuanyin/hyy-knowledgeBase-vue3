export const useBookstacksApi = async (apiFunction, params, loading: boolean = true) => {
  const bookstacksList = ref([])
  const isLoading = ref(loading)

  const getBookstacks = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        bookstacksList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    await getBookstacks()
  }

  return {
    bookstacksList,
    getBookstacks,
    isLoading
  }
}

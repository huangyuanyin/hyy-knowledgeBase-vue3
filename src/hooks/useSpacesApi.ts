export const useSpacesApi = (apiFunction, params, loading: boolean = true) => {
  const spacesList = ref([])
  const isLoading = ref(loading)

  const getSpaces = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        spacesList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    getSpaces()
  }

  return {
    spacesList,
    getSpaces,
    isLoading
  }
}

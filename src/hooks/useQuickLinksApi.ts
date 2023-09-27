export const useQuickLinksApi = async (apiFunction, params, loading: boolean = true) => {
  const quickLinksList = ref([])
  const isLoading = ref(loading)

  const getQuickLinks = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        quickLinksList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  const addQuickLinks = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        quickLinksList.value = res.data || []
      }
    } catch (error) {
      isLoading.value = false
    }
  }

  if (isLoading.value) {
    await getQuickLinks()
  }

  return {
    quickLinksList,
    getQuickLinks,
    isLoading
  }
}

export const useLibraryApi = (apiFunction, params) => {
  const libraryList = ref([])

  const fetchLibrary = async () => {
    try {
      const res = await apiFunction(params)
      if (res.code === 1000) {
        if (Array.isArray(res.data)) {
          libraryList.value = res.data
        } else if (typeof res.data === 'number') {
          console.log('Library ID:', res.data)
        } else {
          console.error('Unexpected response data:', res.data)
        }
      }
    } catch (error) {
      // error
    }
  }

  return {
    libraryList,
    fetchLibrary
  }
}

import { ref } from 'vue'
import { getLibraryApi } from '@/api/library/index'

export const useLibrary = () => {
  const libraryList = ref([])
  const getLibrary = async () => {
    try {
      const res = await getLibraryApi({ Public: 1 })
      if (res.code === 1000) {
        libraryList.value = res.data || []
      }
    } catch (error) {
      console.error('Error while fetching library:', error)
    }
  }

  return {
    libraryList,
    getLibrary
  }
}

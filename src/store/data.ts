export const useDataStore = defineStore('data', () => {
  const isGetBookStacks = ref<Boolean>(false)
  const isGetLibrary = ref<Boolean>(false)
  const isGetQuickList = ref(false)

  const setIsGetBookStacks = (val: boolean) => {
    isGetBookStacks.value = val
  }

  const setIsGetLibrary = (val: boolean) => {
    isGetLibrary.value = val
  }

  const setIsGetQuickList = (val: boolean) => {
    isGetQuickList.value = val
  }

  return {
    isGetBookStacks,
    setIsGetBookStacks,
    isGetLibrary,
    setIsGetLibrary,
    isGetQuickList,
    setIsGetQuickList
  }
})

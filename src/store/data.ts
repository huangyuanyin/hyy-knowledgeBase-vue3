export const useDataStore = defineStore('data', () => {
  const isGetBookStacks = ref<Boolean>(false)

  const setIsGetBookStacks = (val: boolean) => {
    isGetBookStacks.value = val
  }

  return {
    isGetBookStacks,
    setIsGetBookStacks
  }
})

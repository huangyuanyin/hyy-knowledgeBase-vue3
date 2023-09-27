export const useListStore = defineStore('list', () => {
  const refreshQuickListStatus = ref(false)

  const setRefreshQuickListStatus = (val: boolean) => {
    refreshQuickListStatus.value = val
  }

  return { refreshQuickListStatus, setRefreshQuickListStatus }
})

import { getSpacesDetailApi } from '@/api/spaces'

interface CallbackFunction {
  (success: object): void
}

export const useSpace = () => {
  const infoStore = useInfoStore()
  const user = JSON.parse(localStorage.getItem('userInfo'))?.username || ''
  const spacesList = ref([])
  const spaceAdmin = ref<boolean>(false)

  /**
   * 获取空间详情
   * @param {number} id 空间id
   * @param {CallbackFunction} callback 回调函数
   */
  const getSpaceInfo = async (id: number, callback?: CallbackFunction) => {
    if (infoStore.currentSpaceType === '个人') {
      infoStore.setCurrentSpaceInfo(JSON.parse(localStorage.getItem('personalSpaceInfo')))
      infoStore.setIsSpaceAdmin(String(true))
    } else {
      if (infoStore.currentQuery?.type === 'share') return
      let res = await getSpacesDetailApi(id)
      if (res.code === 1000) {
        if (res.data.creator === user) {
          spaceAdmin.value = true
        }
        // 循环res.data，找到item.permusername等于JSON.parse(localStorage.getItem('user')).userInfo.username的项，判断item.permtype是否为0，是则isAdmin为true,否则为false，找到则中止循环
        res.data.members.map((item) => {
          if (item.permusername === user) {
            if (item.permtype === '0') {
              spaceAdmin.value = true
            } else {
              spaceAdmin.value = false
            }
          }
        })
        infoStore.setCurrentSpaceInfo(res.data)
        infoStore.setIsSpaceAdmin(String(spaceAdmin.value))
        callback && (await callback(res.data))
      } else {
        ElMessage.error(res.msg)
      }
    }
  }

  return {
    spacesList,
    getSpaceInfo
  }
}

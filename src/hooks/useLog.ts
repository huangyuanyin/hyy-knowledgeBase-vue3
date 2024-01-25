import { getloginLogApi } from '@/api/log'
import { Callback } from '@/type/type'

export const useLog = () => {
  const loginLog = ref([]) // 用户登录日志

  /**
   * 获取用户登录日志
   * @param {string} id 用户名
   */
  const getloginLog = async (callback?: Callback) => {
    let res = await getloginLogApi()
    if (res.code === 1000) {
      loginLog.value = res.data
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    loginLog,
    getloginLog
  }
}

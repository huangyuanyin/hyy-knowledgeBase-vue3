import { editPasswordApi, editUserApi, getUserApi } from '@/api/user'
import { Callback } from '@/type/type'
import { UserInfo, PasswordInfo } from '@/type/user'

export const useUser = () => {
  const userStore = useUserStore()
  const infoStore = useInfoStore()
  const refreshStore = useRefreshStore()
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}

  /**
   * 获取用户信息
   * @param {string} id 用户名
   */
  const getUserInfo = async (username: string, callback?: Callback) => {
    const params = {
      username
    }
    let res = await getUserApi(params)
    if (res.code === 1000) {
      infoStore.setUserInfo(res.data[0])
      callback && (await callback(res.data[0]))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑用户信息
   * @param {string} userId 用户id
   * @param {UserInfo} userParams 用户信息
   */
  const editUserInfo = async (userId: number, userParams: UserInfo, callback?: Callback) => {
    let res = await editUserApi(userId, userParams)
    if (res.code === 1000) {
      const { avatar, nickname, post, dept, ...info } = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const userInfo = {
        ...info,
        avatar: res.data.avatar,
        nickname: res.data.nickname,
        post: res.data.post,
        dept: res.data.dept
      }
      await userStore.setUserInfo(userInfo)
      await refreshStore.setRefreshUserInfo(true)
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   *
   * @param {PasswordInfo} passwordParams 用户信息
   * @param callback
   */
  const editPassword = async (passwordParams: PasswordInfo, callback?: Callback) => {
    let res = await editPasswordApi(userInfo.userId, passwordParams)
    if (res.code === 1000) {
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    getUserInfo,
    editUserInfo,
    editPassword
  }
}

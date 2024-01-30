import { editPasswordApi, editUserApi, getDepartmentsApi, getPostApi, getUserApi } from '@/api/user'
import { Callback } from '@/type/type'
import { UserInfo, PasswordInfo } from '@/type/user'

export const useUser = () => {
  const userStore = useUserStore()
  const infoStore = useInfoStore()
  const refreshStore = useRefreshStore()
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  const deptList = ref([])
  const postList = ref([])

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
      const { nickname, ...info } = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const userInfo = {
        ...info,
        // avatar: res.data.avatar,
        nickname: res.data[0].nickname,
        dept: res.data[0].dept_name,
        post: res.data[0].post_name
      }
      userStore.setUserInfo(userInfo)
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
      await getUserInfo(res.data.username)
      await refreshStore.setRefreshUserInfo(true)
      callback && (await callback(res.data))
      ElMessage.success('更新成功')
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 编辑密码
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

  /**
   * 获取部门列表
   * @param callback
   */
  const getDepartments = async (callback?: Callback) => {
    let res = await getDepartmentsApi()
    if (res.code === 1000) {
      deptList.value = res.data
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取岗位列表
   * @param callback
   */
  const getPost = async (callback?: Callback) => {
    let res = await getPostApi()
    if (res.code === 1000) {
      postList.value = res.data
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    deptList,
    postList,
    getUserInfo,
    editUserInfo,
    editPassword,
    getDepartments,
    getPost
  }
}

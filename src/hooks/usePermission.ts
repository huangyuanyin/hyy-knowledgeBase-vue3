import { getTeamMemberApi } from '@/api/member'

const user = JSON.parse(localStorage.getItem('user')).userInfo.username || ''
const spaceInfo = JSON.parse(sessionStorage.getItem('spaceInfo')) || {}

// 判断是否有权限访问团队
export const useTeamPermission = (route, router, data) => {
  console.log(`output->data`, data)
  const spaceName = ref(route.path.split('/')[1])
  switch (user) {
    case spaceInfo.creator: // 1.该用户是空间创建者
      toLinkTeam(data)
      break
    case data.creator: // 2.该用户是团队创建者
      toLinkTeam(data)
      break
    default: // 3. 该用户是团队成员
      isHasTeamPermission(data)
      break
  }

  async function isHasTeamPermission(data) {
    const params = {
      group: data.id
    }
    let res = await getTeamMemberApi(params)
    if (res.code === 1000) {
      const isHasPermission = res.data.some((item) => item.username === user)
      if (isHasPermission) {
        toLinkTeam(data)
      } else {
        ElMessage.error('暂无该团队访问权限')
      }
    } else {
      ElMessage.error(res.msg)
    }
  }

  // 跳转到团队首页
  function toLinkTeam(data) {
    router.push({
      path: `/${spaceName.value}/team/book`,
      query: {
        sid: route.query.sid,
        sname: route.query.sname,
        gid: data.id,
        gname: data.groupname
      }
    })
  }
}

const infoStore = useInfoStore()

export const useLink = (router, route, type, data) => {
  switch (type) {
    case 'teamSet':
      router.push({
        path: `/${infoStore.currentSpaceName}/teamSetting/basic`,
        query: {
          sid: data.space,
          sname: route.query.sname,
          gid: data.id,
          gname: data.groupname
        }
      })
      break
    case 'comTeamSet':
      router.push({
        path: `/${infoStore.currentSpaceName}/teamSetting/basic`,
        query: {
          sid: data.space,
          sname: route.query.sname,
          gid: data.target_id,
          gname: data.title
        }
      })
      break
    case 'teamQuit':
      ElMessage.warning('该功能暂未开放，敬请期待')
      break
    case 'comTeamQuit':
      ElMessage.warning('该功能暂未开放，敬请期待')
      break
    case 'comBookSet':
      router.push({
        path: `/${infoStore.currentSpaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: data.target_id,
          lname: data.title
        }
      })
      break
  }
}

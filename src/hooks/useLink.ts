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
    case 'bookSet':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/basic` : `/${infoStore.currentSpaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookSet':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/basic` : `/${infoStore.currentSpaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: data.target_id,
          lname: data.title
        }
      })
      break
    case 'bookPermission':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/collaborators` : `/${infoStore.currentSpaceName}/bookSetting/collaborators`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookPermission':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/collaborators` : `/${infoStore.currentSpaceName}/bookSetting/collaborators`,
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

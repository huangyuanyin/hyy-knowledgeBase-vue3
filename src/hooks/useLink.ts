import qs from 'qs'

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

// 新建不同类型文章后跳转
export const useAddArticleAfterToLink = (route, router, type, data, is, newTab = 'old') => {
  const spaceName = route.path.split('/')[1]
  const query = {
    lid: route.query.lid,
    lname: route.query.lname,
    aid: data.id,
    aname: data.title
  }
  const spaceQuery = {
    sid: route.query.sid,
    sname: route.query.sname,
    gid: route.query.gid,
    gname: route.query.gname
  }
  if (newTab === 'old') {
    router.push({
      path: `${type === '个人' ? '' : `/${spaceName}`}/directory/${data.type}/${is ? 'edit' : ''}`,
      query: {
        ...(type === '个人' ? {} : spaceQuery),
        ...query
      }
    })
  } else {
    window.open(
      `${type === '个人' ? '' : `/${spaceName}`}/directory/${data.type}/?${qs.stringify({
        ...(type === '个人' ? {} : spaceQuery),
        ...query
      })}`
    )
  }
}

import qs from 'qs'

const infoStore = useInfoStore()
const refreshStore = useRefreshStore()

export const useLink = (routerInfo, type, data, spaceType?) => {
  const { route, router } = routerInfo
  const spaceName = route.path.split('/')[1]
  switch (type) {
    case 'teamSet':
      router.push({
        path: `/${spaceName}/teamSetting/basic`,
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
        path: `/${spaceName}/teamSetting/basic`,
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
        path: route.path.split('/')[1] === 'library' ? `/bookSetting/basic` : `/${spaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid || data.group,
          gname: route.query.gname || data.group_name,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookSet': // 从常用列表
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/basic` : `/${spaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: data.group_id,
          gname: data.group_name,
          lid: data.target_id,
          lname: data.title
        }
      })
      break
    case 'bookPermission':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/collaborators` : `/${spaceName}/bookSetting/collaborators`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid || data.group,
          gname: route.query.gname || data.group_name,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookPermission':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/collaborators` : `/${spaceName}/bookSetting/collaborators`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: data.group_id,
          gname: data.group_name,
          lid: data.target_id,
          lname: data.title
        }
      })
      break
    // 从知识库首页跳转到知识库设置
    case 'fromBookToSet':
      router.push({
        path: route.path.split('/')[1] === 'directory' ? `/bookSetting/basic` : `/${spaceName}/bookSetting/basic`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid,
          gname: route.query.gname,
          lid: route.query.lid,
          lname: route.query.lname
        }
      })
      break
    // 从知识库首页跳转到知识库设置 - 目录管理
    case 'fromBookToToc':
      router.push({
        path: route.path.split('/')[1] === 'directory' ? `/bookSetting/toc` : `/${spaceName}/bookSetting/toc`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid,
          gname: route.query.gname,
          lid: route.query.lid,
          lname: route.query.lname
        }
      })
      break
    // 从知识库首页跳转到知识库设置 - 权限管理
    case 'fromBookToCollaborators':
      router.push({
        path: route.path.split('/')[1] === 'directory' ? `/bookSetting/collaborators` : `/${spaceName}/bookSetting/collaborators`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid,
          gname: route.query.gname,
          lid: route.query.lid,
          lname: route.query.lname
        }
      })
      break
    // 从空间管理跳转到团队设置
    case 'fromSpaceSetToTeamBasic':
      window.open(
        `/${route.path.split('/')[1]}/teamSetting/basic?${qs.stringify({
          sid: route.query.sid,
          sname: route.query.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    // 从空间管理跳转到团队首页
    case 'fromSpaceSetToTeamIndex':
      window.open(
        `/${route.path.split('/')[1]}/team/book?${qs.stringify({
          sid: route.query.sid,
          sname: route.query.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    // 从空间管理跳转到团队设置 - 删除
    case 'fromSpaceSetToTeamSettings':
      window.open(
        `/${route.path.split('/')[1]}/teamSetting/settings?${qs.stringify({
          sid: route.query.sid,
          sname: route.query.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    case 'toBookIndex':
      router.push({
        path: `${spaceType === '个人' ? '' : `/${spaceName}`}/directory/index`,
        query: {
          ...(type === '个人'
            ? {
                lid: data.id,
                lname: data.name
              }
            : {
                sid: data.space,
                sname: route.query.sname,
                gid: data.group,
                gname: data.group_name,
                lid: data.id,
                lname: data.name
              })
        }
      })
      break
  }
}

// 新建不同类型文章后跳转
export const useAddArticleAfterToLink = (route, router, type, data, is, newTab = 'old', refresh = true) => {
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
  refresh && refreshStore.setRefreshArticleList(true)
}

import qs from 'qs'
import { environmentPrefix } from '@/data/data'

const infoStore = useInfoStore()
const refreshStore = useRefreshStore()

export const useLink = (routerInfo, type, data, spaceType?) => {
  const { route, router } = routerInfo
  const infoStore = useInfoStore()
  const spaceName = route.path.split('/')[1]

  const basePath = import.meta.env.MODE === 'development' ? '' : `${environmentPrefix[import.meta.env.MODE]}#`

  switch (type) {
    case 'teamSet':
      router.push({
        path: `/${spaceName}/teamSetting/basic`,
        query: {
          sid: data.space,
          sname: infoStore.currentQuery?.sname,
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
          sname: infoStore.currentQuery?.sname,
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
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid || data.group,
          gname: infoStore.currentQuery?.gname || data.group_name,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookSet': // 从常用列表
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/basic` : `/${spaceName}/bookSetting/basic`,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
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
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid || data.group,
          gname: infoStore.currentQuery?.gname || data.group_name,
          lid: data.id,
          lname: data.name
        }
      })
      break
    case 'comBookPermission':
      router.push({
        path: route.path.split('/').length === 2 ? `/bookSetting/collaborators` : `/${spaceName}/bookSetting/collaborators`,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
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
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid,
          gname: infoStore.currentQuery?.gname,
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname
        }
      })
      break
    // 从知识库首页跳转到知识库设置 - 目录管理
    case 'fromBookToToc':
      router.push({
        path: route.path.split('/')[1] === 'directory' ? `/bookSetting/toc` : `/${spaceName}/bookSetting/toc`,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid,
          gname: infoStore.currentQuery?.gname,
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname
        }
      })
      break
    // 从知识库首页跳转到知识库设置 - 权限管理
    case 'fromBookToCollaborators':
      router.push({
        path: route.path.split('/')[1] === 'directory' ? `/bookSetting/collaborators` : `/${spaceName}/bookSetting/collaborators`,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid,
          gname: infoStore.currentQuery?.gname,
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname
        }
      })
      break
    // 从空间管理跳转到团队设置
    case 'fromSpaceSetToTeamBasic':
      window.open(
        `${basePath}/${route.path.split('/')[1]}/teamSetting/basic?${qs.stringify({
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    // 从空间管理跳转到团队首页
    case 'fromSpaceSetToTeamIndex':
      window.open(
        `${basePath}/${route.path.split('/')[1]}/team/book?${qs.stringify({
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    // 从空间管理跳转到团队设置 - 删除
    case 'fromSpaceSetToTeamSettings':
      window.open(
        `${basePath}/${route.path.split('/')[1]}/teamSetting/settings?${qs.stringify({
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: data.id,
          gname: data.groupname
        })}`
      )
      break
    case 'toBookIndex':
      router.push({
        path: `${infoStore.currentSpaceType === '个人' ? '' : `/${spaceName}`}/directory/index`,
        query: {
          ...(infoStore.currentSpaceType === '个人'
            ? {
                sid: data.space,
                lid: data.id,
                lname: data.name
              }
            : {
                sid: data.space,
                sname: infoStore.currentQuery?.sname,
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

interface ArticleData {
  id?: Number
  title: String
  type: String
  [key: string]: any
}

export const useLinkHooks = () => {
  const infoStore = useInfoStore()

  const { sid = '', sname = '', gid = '', gname = '', lid = '', lname = '' } = infoStore.currentQuery || {}

  const { spaceName } = useData()
  const basePath = infoStore.currentSpaceType === '个人' ? '' : `/${spaceName.value}`

  /**
   * 处理文章类型的跳转
   * @param {ArticleData}  data 文章数据
   * @param {Boolean} isEdit 是否编辑状态
   * @param {Boolean} newTab 是否新标签页打开
   * @param {Boolean} refresh 是否重新获取文章目录
   */
  function handleArticleTypeLink(data: ArticleData, isEdit: Boolean, newTab: Boolean = false, refresh: Boolean = false) {
    let query = {
      sid: sid,
      sname: sname,
      lid: lid,
      lname: lname,
      aid: data.id,
      aname: data.title
    }
    const spaceQuery = {
      gid: gid,
      gname: gname
    }
    if (!newTab) {
      router.push({
        path: `${basePath}/directory/${data.type}/${isEdit ? 'edit' : ''}`,
        query: {
          ...(infoStore.currentSpaceType === '个人' ? {} : spaceQuery),
          ...query
        } as any
      })
    } else {
      query = { ...(infoStore.currentSpaceType === '个人' ? {} : spaceQuery), ...query }
      const base64UrlEncode = (data) => {
        const encoded = btoa(unescape(encodeURIComponent(data)))
        return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }
      const hash = base64UrlEncode(JSON.stringify(query))
      window.open(`${environmentPrefix[import.meta.env.MODE]}#${infoStore.currentSpaceType === '个人' ? '' : `/${spaceName.value}`}/directory/${data.type}/?query=${hash}`)
    }
  }

  return { handleArticleTypeLink }
}

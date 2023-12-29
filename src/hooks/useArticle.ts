import Vrouter from '@/router'
import { getArticleTreeApi, getArticleApi, addArticleApi, editArticleApi, deleteArticleApi } from '@/api/article'
import { sheetData } from '@/components/Excel/data'
import { useInfoStore } from '@/store/info'

interface ArticleType {
  [key: string]: { type: string; title: string; body: string }
}

interface CallbackFunction {
  (success: object | boolean | string): void
}

interface ArticleInfo {
  title: string
  description: string
  open_windows: string
}

export const useArticle = () => {
  const route = Vrouter.currentRoute.value
  const infoStore = useInfoStore()
  const dataStore = useDataStore()
  const refreshStroe = useRefreshStore()
  const space = ref<string>('')
  const spaceName = ref<string>('')
  const aid = Number(route.query.aid) // 当前文章id
  const ainfo = ref<ArticleInfo>({} as ArticleInfo) // 当前文章详情
  const lid = Number(route.query.lid) // 当前知识库id
  const isHasPermission = ref<boolean>(true) // 是否有权限
  const currentNodeKey = ref<number>(0) // 当前选中的文章id
  const articleList = ref<any[]>([])
  const articleType: ArticleType = {
    文档: { type: 'doc', title: '无标题文档', body: '' },
    表格: { type: 'sheet', title: '无标题表格', body: '' },
    脑图: { type: 'mind', title: '无标题脑图', body: '' },
    幻灯片: { type: 'ppt', title: '无标题幻灯片', body: '' },
    新建分组: { type: 'title', title: '新建分组', body: '' }
  }

  const { space: sid, spaceName: sname } = useData()
  space.value = sid.value
  spaceName.value = sname.value

  /**
   * 获取知识库目录
   * @param {Number} bookId   当前知识库id
   */
  const getArticleList = async (bookId: Number, callback?: CallbackFunction) => {
    let res = await getArticleTreeApi(bookId)
    isHasPermission.value = res.code === 1003 ? false : true
    if (res.code === 1000) {
      articleList.value = res.data || ([] as any)
      currentNodeKey.value = Number(aid)
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取文章详情
   * @param {number} articleId   当前文章id
   * @param {CallbackFunction} callback 回调函数
   */
  const getArticleDetail = async (articleId: number, callback?: CallbackFunction) => {
    let res = await getArticleApi(articleId)
    if (res.code === 1000) {
      await infoStore.setCurrentArticleInfo(res.data)
      await (ainfo.value = res.data as any)
      callback && (await callback(res.data))
    } else {
      await infoStore.setCurrentArticleInfo('无权限')
      ElMessage.error(res.msg)
      res.code === 1003 && (await callback('无权限'))
    }
  }

  /**
   * 处理新建不同文章逻辑
   * @param {Object} params   当前知识库信息 + 团队信息和新建文章类型
   * @param {Function} callback 回调函数
   * @param {Number} parent   当前文章父级
   */
  function handleAddArticle(params, callback: CallbackFunction, parent: number | null = null) {
    const { book, title } = params
    switch (title) {
      case '脑图':
        articleType[title].body = dataStore.mindMapData
        break
      case '幻灯片':
        articleType[title].body = dataStore.pptData
        break
      case '表格':
        articleType[title].body = sheetData
        break
      default:
        break
    }
    handleAddArticleApi(book, articleType[title], parent, callback)
  }

  /**
   * 调用新建文章接口
   * @param {Object} book     当前知识库信息 + 团队信息
   * @param {Object} article  当前新建文章类型
   * @param {Number} parent   当前文章父级
   * @param {Function} callback 回调函数
   */
  const handleAddArticleApi = async (book, article, parent: number | null, callback: CallbackFunction) => {
    const params = {
      title: article.title,
      type: article.type,
      body: article.body,
      parent,
      book: book.id,
      space: space.value,
      public: '1' // 知识库所有成员都可以访问
    }
    article.type === 'title' && delete params.body
    let res = await addArticleApi(params)
    if (res.code === 1000) {
      if (res.data.type === 'title') {
        ElMessage.success('分组新建成功')
        refreshStroe.setRefreshBookList(true)
      } else {
        const query = {
          lid: book.id,
          lname: book.name,
          aid: res.data.id,
          aname: res.data.title
        }
        const spaceQuery = {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: book.group,
          gname: book.groupname
        }
        await callback(true)
        setTimeout(() => {
          router.push({
            path: `${infoStore.currentSpaceType === '个人' ? '' : `/${spaceName.value}`}/directory/${res.data.type}/${'edit'}`,
            query: {
              ...(infoStore.currentSpaceType === '个人' ? {} : spaceQuery),
              ...query
            }
          })
        }, 500)
      }
    } else {
      ElMessage.error(res.msg)
      callback(false)
    }
  }

  /**
   * 编辑文章
   * @param {Number} id 文章id
   * @param {String | Object} data 文章标题 | 文章信息
   */
  const handleEditArticle = async (id: Number, data: String | Object, callback?: CallbackFunction) => {
    if (!id) return
    let params
    if (typeof data === 'string')
      params = {
        title: data,
        book: lid,
        space: space.value
      }
    else params = data
    let res = await editArticleApi(id, params)
    if (res.code === 1000) {
      if (res.data.type === 'title') {
        await getArticleList(Number(lid), (val: any) => {
          infoStore.currentArticleTreeInfo = val
        })
      } else {
        if (callback) return callback && (await callback(res.data))
        useLinkHooks().handleArticleTypeLink(res.data as any, false)
      }
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 删除文章
   * @param {Number} id 文章id
   */
  const handleDeleteArticle = async (id: Number) => {
    const query = {
      sid: route.query.sid,
      sname: route.query.sname,
      gid: route.query.gid,
      gname: route.query.gname,
      lid: route.query.lid,
      lname: route.query.lname
    }
    let res = await deleteArticleApi(id)
    if (res.code === 1000) {
      ElMessage.success('删除成功')
      await getArticleList(Number(lid))
      if (id != aid && articleList.value.length) return
      const basePath = infoStore.currentSpaceType === '个人' ? '' : `/${spaceName.value}`
      if (articleList.value.length === 0) {
        router.push({
          path: `${basePath}/directory/index`,
          query
        })
      } else {
        router.push({
          path: `${basePath}/directory/${res.data.parent_type}`,
          query: {
            ...query,
            aid: res.data.parent_id,
            aname: res.data.parent_name
          }
        })
      }
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    space: space.value,
    ainfo,
    articleType,
    articleList,
    currentNodeKey,
    getArticleList,
    getArticleDetail,
    handleAddArticle,
    handleAddArticleApi,
    handleEditArticle,
    handleDeleteArticle
  }
}

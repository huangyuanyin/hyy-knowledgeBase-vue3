import { getArticleTreeApi, getArticleApi, addArticleApi, editArticleApi, deleteArticleApi, getCategoryTreeApi, getDocListApi, getRecentArticleListApi } from '@/api/article'
import { sheetData } from '@/components/Excel/data'
import { useInfoStore } from '@/store/info'
import { ArticleType, Callback } from '@/type/type'
import { ArticleInfo } from '@/type/article'
import { ArticleRes, RecentArticleParams } from '@/api/article/type'
import { ArticleParams } from '@/api/article/type'

export const useArticle = () => {
  const infoStore = useInfoStore()
  const dataStore = useDataStore()
  const refreshStroe = useRefreshStore()
  const space = ref<string>('')
  const spaceName = ref<string>('')
  const articleInfo = ref<ArticleInfo>({} as ArticleInfo) // 当前文章详情
  const isHasPermission = ref<boolean>(true) // 是否有权限
  const currentNodeKey = ref<number>(0) // 当前选中的文章id
  const articleList = ref<ArticleInfo[]>([]) // 目录列表
  const articleType: ArticleType = {
    文档: { type: 'doc', title: '无标题文档', body: '' },
    表格: { type: 'sheet', title: '无标题表格', body: '' },
    脑图: { type: 'mind', title: '无标题脑图', body: '' },
    幻灯片: { type: 'ppt', title: '无标题幻灯片', body: '' },
    新建分组: { type: 'title', title: '新建分组', body: '' }
  }

  const { sid = '', sname = '', gid = '', gname = '', lid = '', lname = '', aid = '' } = infoStore.currentQuery || {}
  space.value = sid
  spaceName.value = sname

  function transformTitle(data) {
    const result = []
    function recurse(arr) {
      arr.forEach((item) => {
        result.push({
          title: item.title,
          id: item.id,
          parent: item.parent
        })
        if (item.parent && item.parent.length) {
          recurse(item.parent)
        }
      })
    }
    recurse(data)
    return result.reverse()
  }

  /**
   * 获取知识库目录
   * @param {Number} bookId   当前知识库id
   */
  const getArticleList = async (bookId: Number, callback?: Callback) => {
    let res = await getArticleTreeApi(bookId)
    isHasPermission.value = res.code === 1003 ? false : true
    if (res.code === 1000) {
      articleList.value = res.data as ArticleInfo[]
      infoStore.currentArticleTreeInfo = articleList.value
      currentNodeKey.value = Number(aid)
      callback && (await callback(res.data))
    } else {
      res.code !== 1003 && ElMessage.error(res.msg)
    }
  }

  /**
   * 获取最近编辑过/浏览过的文档列表
   * @param params 参数
   * @param callback
   */
  const getRecentDocList = async (params: RecentArticleParams, callback?: Callback) => {
    params.space = space.value
    let res = await getRecentArticleListApi(params)
    if (res.code === 1000) {
      articleList.value = res.data as ArticleInfo[]
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取文档列表
   * @param {ArticleParams} params 参数
   */
  const getDocList = async (params: ArticleParams, callback?: Callback) => {
    let res = await getDocListApi(params)
    if (res.code === 1000) {
      articleList.value = res.data as ArticleInfo[]
      callback && (await callback(res.data))
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 获取文章详情
   * @param {number} articleId   当前文章id
   * @param {Callback} callback 回调函数
   */
  const getArticleDetail = async (articleId: number, callback?: Callback) => {
    let res = await getArticleApi(articleId)
    if (res.code === 1000) {
      await infoStore.setCurrentArticleInfo(res.data as ArticleInfo)
      await (articleInfo.value = res.data as ArticleInfo)
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
  function handleAddArticle(params, callback: Callback, parent: number | null = null) {
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
    console.log(`output->book`, book, title, articleType[title])
    handleAddArticleApi(book, articleType[title], parent, callback)
  }

  /**
   * 调用新建文章接口
   * @param {Object} book     当前知识库信息 + 团队信息
   * @param {Object} article  当前新建文章类型
   * @param {Number} parent   当前文章父级
   * @param {Function} callback 回调函数
   */
  const handleAddArticleApi = async (book, article, parent: number | null, callback: Callback) => {
    console.log(`output->`, article)
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
    let res = (await addArticleApi(params)) as ArticleRes<ArticleInfo>
    if (res.code === 1000) {
      if (res.data.type === 'title') {
        ElMessage.success('分组新建成功')
        refreshStroe.setRefreshBookList(true)
      } else {
        const query = {
          sid,
          sname,
          lid: book.id,
          lname: book.name,
          aid: res.data.id,
          aname: res.data.title
        }
        const spaceQuery = {
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
  const handleEditArticle = async (id: Number, data: String | Object, callback?: Callback) => {
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
      // if (res.data.type === 'title') {
      //   await getArticleList(Number(lid), (val: any) => {
      //     infoStore.currentArticleTreeInfo = val
      //   })
      // } else {
      //   if (callback) return callback && (await callback(res.data))
      //   useLinkHooks().handleArticleTypeLink(res.data as any, false)
      // }
      if (callback) return callback && (await callback(res.data))
      useLinkHooks().handleArticleTypeLink(res.data as any, false)
    } else {
      ElMessage.error(res.msg)
    }
  }

  /**
   * 删除文章提示弹窗
   * @param article 文章信息
   */
  const toDeleteArticle = (article: any) => {
    const confirmMessage = article.children ? `同时删除【${article.title}】下的所有文档` : `确认删除【${article.title}】吗？`
    const confirmTitle = article.children ? `确认删除【${article.title}】吗？` : ''
    ElMessageBox.confirm(confirmMessage, confirmTitle, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      confirmButtonClass: 'submitBtn',
      cancelButtonClass: 'cancelBtn',
      customClass: 'deleteArticleDialog',
      type: 'warning',
      showClose: false
    })
      .then(() => {
        handleDeleteArticle(article.id)
      })
      .catch(() => {
        ElMessage.info('取消操作')
      })
  }

  /**
   * 删除文章
   * @param {Number} id 文章id
   */
  const handleDeleteArticle = async (id: Number) => {
    const query = {
      sid: sid,
      sname: sname,
      gid: gid,
      gname: gname,
      lid,
      lname: lname
    }
    let res = (await deleteArticleApi(id)) as any
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

  /**
   * 获取上层节点
   * @param {number} id 文章id
   * @param {string} nodeType 节点类型
   * @param {Function} callback 回调函数
   */
  const handleCategoryTree = async (aid: number, nodeType: string = 'parent', callback?: Callback) => {
    const params = {
      node_id: aid,
      action: nodeType
    }
    let res = await getCategoryTreeApi(params)
    if (res.code === 1000) {
      let result = transformTitle(res.data)
      callback && (await callback(result))
    } else {
      ElMessage.error(res.msg)
    }
  }

  return {
    space: space.value,
    articleInfo,
    articleType,
    articleList,
    currentNodeKey,
    isHasPermission,
    toDeleteArticle,
    getArticleList,
    getDocList,
    getArticleDetail,
    getRecentDocList,
    handleAddArticle,
    handleAddArticleApi,
    handleEditArticle,
    handleDeleteArticle,
    handleCategoryTree
  }
}

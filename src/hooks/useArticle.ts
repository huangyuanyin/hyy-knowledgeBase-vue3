import Vrouter from '@/router'
import { addArticleApi } from '@/api/article'

interface ArticleType {
  [key: string]: { type: string; title: string; body: string }
}

interface CallbackFunction {
  (success: boolean): void
}

export const useArticle = () => {
  const route = Vrouter.currentRoute.value
  const dataStore = useDataStore()
  const refreshStroe = useRefreshStore()
  const space = ref<string>('')
  const spaceType = ref<string>('')
  const articleType: ArticleType = {
    文档: { type: 'doc', title: '无标题文档', body: '' },
    表格: { type: 'sheet', title: '无标题表格', body: '' },
    脑图: { type: 'mind', title: '无标题脑图', body: '' },
    幻灯片: { type: 'ppt', title: '无标题幻灯片', body: '' },
    新建分组: { type: 'title', title: '新建分组', body: '' }
  }

  watch(
    () => route.fullPath,
    () => {
      const setSpaceAndType = (value: string, type: string) => {
        space.value = value
        spaceType.value = type
      }
      const personalSpaceInfo = JSON.parse(localStorage.getItem('personalSpaceInfo'))
      switch (route.meta.asideComponent) {
        case 'SpaceSidebar':
          setSpaceAndType(route.query.sid as string, '组织')
          break
        case 'Sidebar':
          setSpaceAndType(personalSpaceInfo.id, '个人')
          break
        case 'DirectorySidebar':
          if (route.path.split('/')[1] === 'directory') {
            setSpaceAndType(personalSpaceInfo.id, '个人')
          } else {
            setSpaceAndType(route.query.sid as string, '组织')
          }
          break
      }
    },
    {
      immediate: true
    }
  )

  /**
   * @param {Object} params   当前知识库信息 + 团队信息和新建文章类型
   * @param {Function} callback 回调函数
   * @param {Number} parent   当前文章父级
   */
  function handleAddArticle(params, callback: CallbackFunction, parent?: number | null = null) {
    const { book, title } = params
    switch (title) {
      case '脑图':
        articleType[title].body = dataStore.mindMapData
        break
      case '幻灯片':
        articleType[title].body = dataStore.pptData
        break
      default:
        break
    }
    handleAddArticleApi(book, articleType[title], parent, callback)
  }

  // 处理新建不同文章逻辑
  /**
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
        const spaceName = route.path.split('/')[1]
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
            path: `${spaceType.value === '个人' ? '' : `/${spaceName}`}/directory/${res.data.type}/${'edit'}`,
            query: {
              ...(spaceType.value === '个人' ? {} : spaceQuery),
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

  return { space: space.value, spaceType: spaceType.value, articleType, handleAddArticle, handleAddArticleApi }
}

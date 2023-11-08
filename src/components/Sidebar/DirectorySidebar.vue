<script lang="ts" setup>
import { sidebarSearchMenuItemsData, articleOperationData, linkOperationData, titleOperationData } from '@/data/data'
import { addArticleApi, deleteArticleApi, editArticleApi, getArticleTreeApi } from '@/api/article'

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const bookId = ref('') // 当前知识库id
const spaceType = ref<string>('') // 空间类型：个人 组织
const dataSource = ref([])
const bookTree = ref(null)
const currentNodeKey = ref(Number(route.query.aid)) // 当前选中的节点
const isAllExpand = ref(true) // 是否全部展开
const group_name = ref<string>('')
const nickName = ref<string>(infoStore.currentSpaceInfo.nickname || route.fullPath.split('/')[1])
const showMoveDialog = ref(false)
const isShowLinkDialog = ref(false)
const linkType = ref('add') // 链接弹窗类型： add edit
const linkDialogId = ref(null) // 链接弹窗id
const parentId = ref(null) // 父级节点id
const reName = ref('')
const reNameId = ref(null)
const reNameParent = ref(null)
const toLinkId = ref(null) // 删除完成后跳转的id
const toLinkName = ref('')
const articleType = {
  文档: { type: 'doc', title: '无标题文档' },
  表格: { type: 'sheet', title: '无标题表格' },
  新建分组: { type: 'title', title: '新建分组' }
}

// 监听currentNodeKey
watch(
  () => currentNodeKey.value,
  (newVal) => {
    bookTree.value.setCurrentKey(newVal)
  }
)

watchEffect(() => {
  if (refreshStroe.isRefreshBookList) {
    getArticle()
    refreshStroe.setRefreshBookList(false)
  }
})

watchEffect(() => {
  nextTick(async () => {
    spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
    group_name.value = route.query.gname as string
    bookId.value = route.query.lid as string
    if (bookId.value) {
      await getArticle()
    }
  })
})

const toLink = (type?: string) => {
  if (type === 'link') {
    switch (spaceType.value) {
      case '个人':
        router.push('/library')
        break
      case '组织':
        if (group_name.value === '公共区') {
          router.push({
            path: `/${nickName.value}/public`,
            query: {
              sid: route.query.sid,
              sname: route.query.sname,
              gid: route.query.gid,
              gname: route.query.gname
            }
          })
        } else {
          router.push({
            path: `/${nickName.value}/team/book`,
            query: {
              sid: route.query.sid,
              sname: route.query.sname,
              gid: route.query.gid,
              gname: route.query.gname
            }
          })
        }
        break
      default:
        break
    }
  } else if (type === 'back') {
    switch (spaceType.value) {
      case '个人':
        router.push('/')
        break
      case '组织':
        router.push({
          path: `/${nickName.value}/dashboard`,
          query: {
            sid: route.query.sid,
            sname: route.query.sname
          }
        })
        break
      default:
        break
    }
  } else if (type === 'index') {
    if (spaceType.value === '个人') {
      router.push({
        path: `/directory/index`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: route.query.lid,
          lname: route.query.lname
        }
      })
    } else {
      router.push({
        path: `/${nickName.value}/directory/index`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          lid: route.query.lid,
          lname: route.query.lname,
          gid: route.query.gid,
          gname: route.query.gname
        }
      })
    }
  }
}

// 获取目录
const getArticle = async () => {
  let res = await getArticleTreeApi(bookId.value as string)
  if (res.code === 1000) {
    dataSource.value = res.data || ([] as any)
    // 取出res.data中的第一项的id
    if (res.data.length) {
      toLinkId.value = res.data[0].id
      toLinkName.value = res.data[0].title
    }
  }
}

const toArticleDetail = (val) => {
  val.type === 'links' || val.type === 'title' ? bookTree.value.setCurrentKey(Number(route.query.aid)) : (currentNodeKey.value = val.id)
  console.log(`output->val`, currentNodeKey.value)
  if (val.id == route.query.aid) return
  switch (val.type) {
    case 'links':
      val.open_windows === '1' ? window.open(val.description) : (window.location.href = val.description)
      break
    case 'title':
      break
    default:
      useAddArticleAfterToLink(route, router, spaceType.value, val, false)
      break
  }
}

const moveArticle = (val) => {
  console.log(`output->val`, val)
  showMoveDialog.value = true
}

// 重命名
const toRename = (val) => {
  reNameId.value = val.id
  reNameParent.value = val.parent
  reName.value = val.title
}

const handleRename = () => {
  editArticle()
}

// 编辑文档
const toEditArticle = (val) => {
  useAddArticleAfterToLink(route, router, spaceType.value, val, true)
}

// 新标签页打开
const toNewTab = (val) => {
  useAddArticleAfterToLink(route, router, spaceType.value, val, true, 'new')
}

const toTodo = (val) => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

// 编辑链接弹窗
const toEditLink = (val) => {
  parentId.value = val.parent
  linkType.value = 'edit'
  linkDialogId.value = val.id
  isShowLinkDialog.value = true
}

const toAddDoc = (data?) => {
  addArticle(articleType['文档'], data === null ? null : data.id)
}

const toAddSheet = (data) => {
  addArticle(articleType['表格'], data.id)
}

const toAddLink = (data) => {
  parentId.value = data.id
  isShowLinkDialog.value = true
}

const toAddGroup = (data) => {
  addArticle(articleType['新建分组'], data.id)
}

const addArticle = async (article, parent) => {
  const params = {
    title: article.title,
    book: route.query.lid as string,
    space: spaceType.value === '个人' ? localStorage.getItem('personalSpaceId') : (route.query.sid as string),
    type: article.type,
    body: '',
    parent
  }
  article.type === 'title' && delete params.body
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    if (res.data.type === 'title') {
      getArticle()
      ElMessage.success('分组新建成功')
    } else {
      useAddArticleAfterToLink(route, router, spaceType.value, res.data, true)
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const editArticle = async () => {
  const params = {
    title: reName.value,
    book: route.query.lid as string,
    space: spaceType.value === '个人' ? localStorage.getItem('personalSpaceId') : (route.query.sid as string)
  }
  let res = await editArticleApi(reNameId.value, params)
  if (res.code === 1000) {
    reNameId.value = null
    if (res.data.type === 'title') {
      getArticle()
    } else {
      useAddArticleAfterToLink(route, router, spaceType.value, res.data, false)
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteArticle = async (id) => {
  let res = await deleteArticleApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    await getArticle()
    if (id != route.query.aid) return
    if (dataSource.value.length === 0) {
      router.push({
        path: `/${route.path.split('/')[1]}/directory/index`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: route.query.gid,
          gname: route.query.gname,
          lid: route.query.lid,
          lname: route.query.lname
        }
      })
    } else {
      if (spaceType.value === '个人') {
        router.push({
          path: `/directory/doc`,
          query: {
            ...route.query,
            aid: toLinkId.value,
            aname: toLinkName.value
          }
        })
      } else {
        router.push({
          path: `/${route.path.split('/')[1]}/directory/doc`,
          query: {
            ...route.query,
            aid: toLinkId.value,
            aname: toLinkName.value
          }
        })
      }
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const toDeleteArticle = (val) => {
  ElMessageBox.confirm(`确认删除【${val.title}】吗？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    confirmButtonClass: 'submitBtn',
    cancelButtonClass: 'cancelBtn',
    customClass: 'deleteArticleDialog',
    type: 'warning',
    showClose: false
  })
    .then(() => {
      deleteArticle(val.id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

const closeLinkDialog = () => {
  isShowLinkDialog.value = false
  linkType.value = 'add'
}

const toScroll = () => {
  // const nodes = bookTree.value.store.nodesMap
  // console.log(`output->bookTree.value.store.nodesMap`, bookTree.value.store.nodesMap, currentNodeKey.value)
  // for (var i in nodes) {
  //   if (nodes[i].data.id === Number(currentNodeKey.value)) {
  //     if (nodes[i].data.parent !== null) {
  //       console.log(`output->nodes[i]`, nodes[i])
  //       nodes[i].expanded = true
  //       for (var j in nodes[i].parent.childNodes) {
  //         nodes[i].parent.childNodes[j].expanded = true
  //       }
  //     }
  //   }
  // }
  // console.log(`output->`, bookTree.value.store.nodesMap)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toExpand = (type) => {
  isAllExpand.value = type
  const nodes = bookTree.value.store.nodesMap
  for (var i in nodes) {
    nodes[i].expanded = type
  }
}

const customIcon = () => {
  return h('img', { src: '/src/assets/icons/miniDropDownIcon.svg' }) // 默认图标路径
}

onMounted(async () => {})
</script>

<template>
  <div class="DirectorySidebar-wrap">
    <div class="header-box">
      <div class="header">
        <img v-if="spaceType === '个人'" class="favicon" src="/src/assets/favicon.ico" @click="toLink('back')" />
        <img v-else class="favicon" src="/src/assets/icons/spaceIcon.svg" @click="toLink('back')" />
        <img class="rightArrowIcon" src="/src/assets/icons/rightArrowIcon.svg" alt="" />
        <span @click="toLink('link')">{{ spaceType === '个人' ? '个人知识库' : `${group_name}` }}</span>
      </div>
      <div class="library-name">
        <div class="left">
          <img class="bookIcon" src="/src/assets/icons/bookIcon.svg" alt="" />
          <div class="name">
            <span>{{ $route.query.lname }}</span>
            <img class="privateIcon" src="/src/assets/icons/privateIcon.svg" alt="" />
          </div>
        </div>
        <div class="right">
          <img class="moreIcon" src="/src/assets/icons/moreIcon1_after.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="search">
      <SidebarSearch :menuItems="sidebarSearchMenuItemsData" />
    </div>
    <div class="directory-list">
      <div :class="['index', route.name === 'Space-Directory' || route.name === 'Directory' ? 'is_selected' : '']" @click="toLink('index')">
        <img class="indexIcon" src="/src/assets/icons/indexIcon.svg" alt="" />
        <span>首页</span>
      </div>
      <div class="directory">
        <div class="left">
          <img class="directoryIcon" src="/src/assets/icons/directoryIcon.svg" alt="" />
          <span>目录</span>
        </div>
        <div class="right">
          <el-tooltip effect="dark" content="目录定位" placement="top" :show-arrow="false">
            <span><img class="locateIcon" src="/src/assets/icons/locateIcon.svg" alt="" @click="toScroll" /></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="全部折叠" placement="top" :show-arrow="false" v-if="isAllExpand">
            <span v-if="isAllExpand"><img class="expandIcon" src="/src/assets/icons/expandIcon.svg" alt="" @click="toExpand(false)" /></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="全部展开" placement="top" :show-arrow="false" v-if="!isAllExpand">
            <span v-if="!isAllExpand"><img class="foldIcon" src="/src/assets/icons/foldIcon.svg" alt="" @click="toExpand(true)" /></span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="empty" v-if="!dataSource.length">
      <img src="@/assets/img/empty.png" alt="" />
      <div>知识库为空，你可以<span @click="toAddDoc(null)">新建文档</span></div>
    </div>
    <div class="list" v-else>
      <el-tree
        ref="bookTree"
        :data="dataSource"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="{ class: 'forumList' }"
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        :icon="customIcon"
        @node-click="toArticleDetail"
      >
        <template #default="{ data }">
          <span class="list-node">
            <div class="title">
              <el-input v-if="reNameId === data.id" v-model="reName" :id="data.id" autofocus @change="handleRename" />
              <span v-else>{{ data.title }}</span>
            </div>
            <div class="button" v-if="reNameId !== data.id">
              <LibraryOperationPopver
                :menuItems="articleOperationData"
                :height="32"
                :width="150"
                @toRename="toRename(data)"
                @toEditArticle="toEditArticle(data)"
                @toNewTab="toNewTab(data)"
                @toTodo="toTodo(data)"
                @moveArticle="moveArticle(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type !== 'links' && data.type !== 'title'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <LibraryOperationPopver
                :menuItems="linkOperationData"
                :height="32"
                :width="150"
                @moveArticle="moveArticle(data)"
                @toRename="toEditLink(data)"
                @toTodo="toTodo(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type === 'links'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <LibraryOperationPopver
                :menuItems="titleOperationData"
                :height="32"
                :width="150"
                @toRename="toRename(data)"
                @toTodo="toTodo(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type === 'title'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <AddOperationPopver
                :menu-items="sidebarSearchMenuItemsData"
                trigger="click"
                @toAddDoc="toAddDoc(data)"
                @toAddSheet="toAddSheet(data)"
                @toAddGroup="toAddGroup(data)"
                @toAddLink="toAddLink(data)"
              >
                <span class="addIcon" @click.stop>
                  <img src="/src/assets/icons/addIcon.svg" alt="" />
                </span>
              </AddOperationPopver>
            </div>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
  <MoveDialog :isShow="showMoveDialog" @closeDialog="showMoveDialog = false" />
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" :type="linkType" :id="linkDialogId" @closeDialog="closeLinkDialog" />
</template>

<style lang="scss" scoped>
.DirectorySidebar-wrap {
  background-color: #fff;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .header-box {
    display: flex;
    align-items: center;
    flex-flow: column;
    margin: 0 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    padding: 0 0 12px;
    .header {
      display: flex;
      align-items: center;
      width: 100%;
      height: 45px;
      padding: 16px 0 6px 6px;
      box-sizing: border-box;
      .favicon {
        cursor: pointer;
        display: inline-flex;
        width: 16px;
        height: 16px;
        border-radius: 4px;
      }
      .rightArrowIcon {
        width: 14px;
        height: 14px;
        color: #8a8f8d;
        margin: 2px;
        transform: rotate(-180deg);
      }
      span {
        font-size: 12px;
        cursor: pointer;
        color: #8a8f8d;
        flex: 1;
      }
    }
    .library-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .left {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 0 10px 0 0;

        .bookIcon {
          width: 20px;
          height: 20px;
          margin: 0 10px 0 4px;
        }
        .name {
          display: flex;
          align-items: center;
          span {
            font-size: 16px;
            color: #262626;
            font-weight: 700;
            line-height: 22px;
            font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
              sans-serif;
          }
          .privateIcon {
            width: 14px;
            height: 14px;
            min-width: 14px;
            margin-left: 6px;
          }
        }
      }
      .right {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 8px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
    }
  }
  .search {
    :deep(.SidebarSearch-wrap) {
      padding: 0 8px;
      margin-bottom: 0px;
    }
  }
  .directory-list {
    .index {
      display: flex;
      align-items: center;
      padding: 5px 8px;
      margin: 10px 8px 0 8px;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
      img {
        width: 16px;
        height: 16px;
        margin: 0 12px 0 0;
      }
      span {
        font-size: 14px;
        line-height: 22px;
      }
      &:hover {
        background-color: #eff0f0;
      }
    }
    .is_selected {
      background-color: #eff0f0;
    }
    .directory {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px 0 16px;
      line-height: 32px;
      margin: 6px 0 0 0;
      .left {
        display: flex;
        align-items: center;
        img {
          margin-right: 12px;
        }
        span {
          font-size: 14px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          margin-left: 8px;
          cursor: pointer;
          &:hover {
            background-color: #eff0f0;
          }
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
  .empty {
    width: 345px;
    padding: 0 30px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    font-size: 14px;
    color: #8a8f8d;
    img {
      width: 100px;
      height: 64px;
      margin-bottom: 20px;
    }
    span {
      color: #117cee;
      cursor: pointer;
    }
  }
  .is-current {
    .el-tree-node__content {
      span {
        color: #262626 !important;
        font-weight: 700 !important;
      }
    }
    .el-tree-node__children {
      span {
        font-weight: 500 !important;
      }
    }
  }
  .list {
    flex: 1;
    overflow-y: scroll;
    width: 100%;
    height: auto;
    padding: 0 8px;
    box-sizing: border-box;
    :deep(.forumList) {
      width: 100%;
      box-sizing: border-box;
      .el-tree-node__content {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-radius: 6px;
        height: 34px;
        color: #262626;
        padding-right: 6px;
        border: 1.5px solid transparent;
        margin-bottom: 2px;
        box-sizing: border-box;
        &:hover {
          background-color: #eff0f0;
          border: 1px solid #eff0f0;
          box-sizing: border-box;
        }
        .el-tree-node__expand-icon.expanded {
          transform: rotate(0deg);
        }
        .el-tree-node__expand-icon {
          transform: rotate(-90deg);
          transition: none;
        }
        .el-icon {
          border-radius: 6px;
          margin-right: 4px;
          &:hover {
            background-color: #d8dad9;
            border: 1px solid #d8dad9;
          }
        }
      }

      .list-node {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          display: flex;
          align-items: center;
          flex: 1;
          overflow: hidden;
          font-size: 14px;
          font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
            sans-serif;
          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            transition: transform 0.2s ease;
            border-radius: 6px;
            margin-right: 4px;
            transition: background 0.35s ease-in-out;
            img {
              width: 16px;
              min-width: 16px;
              height: 16px;
            }
            &:hover {
              background-color: #d8dad9;
            }
            .foldIcon {
              // transform: rotate(90deg);
              transition: transform 0.3s;
            }
          }
          .no-icon {
            width: 24px;
            min-width: 24px;
            height: 24px;
            &:hover {
              background-color: transparent;
            }
          }
          span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .button {
          display: none;
          margin-left: 8px;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 6px;
            transition: background 0.35s ease-in-out;
            &:hover {
              background-color: #e7e9e8;
            }
          }
          .moreIcon {
            margin-right: 8px;
            transform: rotate(90deg);
          }
        }
        &:hover {
          .button {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    &::-webkit-scrollbar {
      max-height: 60px;
      width: 6px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      height: 60px;
      border-radius: 30px;
      background-color: #e7e9e8;
      &:hover {
        background-color: #c1c1c1;
      }
      &:active {
        background-color: #c1c1c1;
      }
    }
  }
}
</style>

<style lang="scss">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eff0f0;
}
.deleteArticleDialog {
  .submitBtn,
  .cancelBtn {
    margin-left: 8px;
    border-radius: 6px;
    box-shadow: none;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    margin-top: 24px;
  }
  .submitBtn {
    color: #fff;
    background: #00b96b;
    border-color: #00b96b;
  }
  .cancelBtn {
    color: #262626;
    background: #fff;
    border-color: #e7e9e8;
    &:hover {
      color: #00b96b;
      border-color: #00b96b;
    }
  }
}
</style>

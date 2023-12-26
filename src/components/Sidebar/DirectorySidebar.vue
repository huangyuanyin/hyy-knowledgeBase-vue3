<script lang="ts" setup>
import { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import miniDropDownIcon from '@/assets/icons/miniDropDownIcon.svg'
import linkTypeIcon from '@/assets/icons/linkType.svg'
import fileTypeIcon from '@/assets/icons/fileType.svg'
// @ts-ignore
import { sidebarSearchMenuItemsData, articleOperationData, linkOperationData, titleOperationData, fileOperationData, directorySidebarOperationData } from '@/data/data'
import { useLinkHooks } from '@/hooks/useLink'

const route = useRoute()
const routeInfo = {
  route,
  router
}
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const spaceId = ref('') // 当前空间id
const bookId = ref('') // 当前知识库id
const currentBookInfo = ref(null) // 当前知识库信息
const dataSource = ref([])
const bookTree = ref(null)
const currentNodeKey = ref(Number(route.query.aid)) // 当前选中的节点
const isAllExpand = ref(true) // 是否全部展开
const group_name = ref<string>('')
const nickName = ref<string>(infoStore.currentSpaceInfo.nickname || route.fullPath.split('/')[1])
const showHandleArticleDialog = ref(false)
const isShowLinkDialog = ref(false)
const isShowExportFileDialog = ref(false)
const isLoading = ref(false)
const exportId = ref(null)
const exportType = ref('')
const handleArticleDialogTitle = ref('')
const handleArticleDialogDesc = ref('')
const handleData = ref(null) // 复制 || 移动的数据
const linkType = ref('add') // 链接弹窗类型： add edit
const linkDialogId = ref(null) // 链接弹窗id
const parentId = ref(null) // 父级节点id
const reName = ref('')
const reNameId = ref(null)
const reNameParent = ref(null)
const isHasPermissionCode = ref(null)
const bookIcon = ref('/src/assets/icons/bookIcon.svg')
const defaultProps = {
  class: 'forumList'
} as unknown as TreeOptionProps
const inputName = ref(null)

watchEffect(() => {
  bookId.value = route.query.lid as string
  if (isHasPermissionCode.value === 1003) {
    isHasPermissionCode.value = null
    router.replace('/no-permission')
  }
  if (refreshStroe.isRefreshBookList) {
    nextTick(() => {
      handleArticleList()
    })
    refreshStroe.setRefreshBookList(false)
  }
  if (refreshStroe.isRefreshArticleList) {
    nextTick(() => {
      handleArticleList()
    })
    console.log(`output->111`, 111)
    refreshStroe.setRefreshArticleList(false)
  }
  nextTick(async () => {
    spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
    group_name.value = route.query.gname as string
    bookId.value = route.query.lid as string
    if (bookId.value) {
      console.log(`output->2222`, 2222)
      handleArticleList()
    }
    if (sessionStorage.getItem('currentBookInfo')) {
      bookIcon.value = JSON.parse(sessionStorage.getItem('currentBookInfo')).icon
      currentBookInfo.value = JSON.parse(sessionStorage.getItem('currentBookInfo'))
    }
  })
})

watch(
  () => route.query.lid,
  (newVal) => {
    if (newVal) {
      currentNodeKey.value = Number(route.query.aid)
    }
  },
  {
    immediate: true
  }
)

// 监听currentNodeKey
watch(
  () => currentNodeKey.value,
  (newVal) => {
    isLoading.value = true
    setTimeout(() => {
      bookTree.value.setCurrentKey(newVal)
      isLoading.value = false
    }, 500)
  }
)

function getBookInfo() {
  return {
    id: route.query.lid as string,
    name: route.query.lname as string,
    group: route.query.gid as string,
    groupname: route.query.gname as string
  }
}

function handleAddArticle(title: string, data?) {
  const book = getBookInfo()
  useArticle().handleAddArticle({ book, title }, () => {}, data === null ? null : data?.id)
}

async function handleArticleList() {
  const { articleList, currentNodeKey: node, getArticleList } = useArticle()
  await getArticleList(Number(bookId.value))
  dataSource.value = articleList.value
  currentNodeKey.value = node.value
}

const toLink = (type?: string) => {
  if (type === 'link') {
    switch (infoStore.currentSpaceType) {
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
    switch (infoStore.currentSpaceType) {
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
    console.log(`output->111`, 111)
    currentNodeKey.value = null
    if (infoStore.currentSpaceType === '个人') {
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

const toArticleDetail = (val) => {
  if (val.id == route.query.aid) return
  val.type === 'links' || val.type === 'title' ? bookTree.value.setCurrentKey(Number(route.query.aid)) : (currentNodeKey.value = val.id)
  switch (val.type) {
    case 'links':
      val.open_windows === '1' ? window.open(val.description) : (window.location.href = val.description)
      break
    case 'title':
      break
    default:
      useLinkHooks().handleArticleTypeLink(val, false)
      break
  }
}

// 重命名
const toRename = (val) => {
  reNameId.value = val.id
  reNameParent.value = val.parent
  reName.value = val.title
  nextTick(() => {
    inputName.value.focus()
    inputName.value.select()
  })
}

const handleRename = () => {
  useArticle().handleEditArticle(reNameId.value, reName.value)
  reNameId.value = null
}

// 复制链接
const toCopyLink = (val) => {
  const linkUrl = ref('')
  const spaceName = route.path.split('/')[1]
  if (val.type === 'links') {
    linkUrl.value = val.description
  } else {
    if (infoStore.currentSpaceType === '个人') {
      linkUrl.value = `${window.location.origin}/#/directory/${val.type}?lid=${val.book}&lname=${route.query.lname}&aid=${val.id}&aname=${val.title}`
    } else {
      linkUrl.value = `${window.location.origin}/#/${spaceName}/directory/${val.type}?sid=${route.query.sid}&sname=${route.query.sname}&gid=${route.query.gid}&gname=${route.query.gname}&lid=${val.book}&lname=${route.query.lname}&aid=${val.id}&aname=${val.title}`
    }
  }
  useCopy(linkUrl.value)
}

// 复制 || 移动
const toHandleArticle = (type, val) => {
  handleData.value = val
  showHandleArticleDialog.value = true
  if (type === 'move') {
    handleArticleDialogTitle.value = '移动到...'
    handleArticleDialogDesc.value = '可移动到有创建文档权限的知识库'
  } else {
    handleArticleDialogTitle.value = '复制到...'
    handleArticleDialogDesc.value = '可复制到有创建文档权限的知识库'
  }
}

// 导出
const toExport = (val) => {
  exportId.value = val.id
  exportType.value = val.type
  isShowExportFileDialog.value = true
}

const toTodo = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}

// 编辑链接弹窗
const toEditLink = (val) => {
  parentId.value = val.parent
  linkType.value = 'edit'
  linkDialogId.value = val.id
  isShowLinkDialog.value = true
}

const toAddLink = (data) => {
  parentId.value = data.id
  isShowLinkDialog.value = true
}

async function deleteArticle(id: Number) {
  const { articleList, currentNodeKey: node, handleDeleteArticle } = useArticle()
  await handleDeleteArticle(id)
  dataSource.value = articleList.value
  currentNodeKey.value = node.value
}

const toDeleteArticle = (val) => {
  const confirmMessage = val.children ? `同时删除【${val.title}】下的所有文档` : `确认删除【${val.title}】吗？`
  const confirmTitle = val.children ? `确认删除【${val.title}】吗？` : ''
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
      deleteArticle(val.id)
    })
    .catch(() => {
      ElMessage.info('取消操作')
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

const toPermission = () => {
  useLink(routeInfo, 'fromBookToCollaborators', {})
}

const toDirManage = () => {
  useLink(routeInfo, 'fromBookToToc', {})
}

const toMoreSetting = () => {
  useLink(routeInfo, 'fromBookToSet', {})
}

const customIcon = () => {
  return h('img', { src: miniDropDownIcon }) // 默认图标路径
}
</script>

<template>
  <div class="DirectorySidebar-wrap">
    <div class="header-box">
      <div class="header">
        <img v-if="infoStore.currentSpaceType === '个人'" class="favicon" src="/src/assets/favicon.ico" @click="toLink('back')" />
        <img
          v-else-if="infoStore.currentSpaceType !== '个人' && route.query.gname !== '公共区'"
          class="favicon"
          :src="currentBookInfo && currentBookInfo.group_icon"
          @click="toLink('back')"
        />
        <img v-else-if="infoStore.currentSpaceType !== '个人' && route.query.gname === '公共区'" class="favicon" src="/src/assets/icons/spaceIcon.svg" alt="" />
        <img class="rightArrowIcon" src="/src/assets/icons/rightArrowIcon.svg" alt="" />
        <span @click="toLink('link')">{{ infoStore.currentSpaceType === '个人' ? '个人知识库' : `${group_name}` }}</span>
      </div>
      <div class="library-name">
        <div class="left">
          <img class="bookIcon" :src="bookIcon" alt="" />
          <div class="name">
            <span>{{ $route.query.lname }}</span>
            <img class="privateIcon" src="/src/assets/icons/privateIcon.svg" alt="" />
          </div>
        </div>
        <div class="right">
          <LibraryOperationPopver
            :menuItems="directorySidebarOperationData"
            placement="bottom-start"
            @toPermission="toPermission"
            @toDirManage="toDirManage"
            @toMoreSetting="toMoreSetting"
          >
            <img class="moreIcon" src="/src/assets/icons/moreIcon1_after.svg" alt="" />
          </LibraryOperationPopver>
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
      <div>知识库为空，你可以<span @click="handleAddArticle('文档', null)">新建文档</span></div>
    </div>
    <div class="list" v-else>
      <el-tree
        v-loading="isLoading"
        element-loading-text="文章加载中..."
        ref="bookTree"
        :data="dataSource"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="defaultProps"
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        :icon="customIcon"
        @node-click="toArticleDetail"
      >
        <template #default="{ data }">
          <span class="list-node">
            <div class="title">
              <input class="editTitle" ref="inputName" id="inputName" v-if="reNameId === data.id" v-model="reName" type="text" @blur="handleRename" />
              <span v-else>{{ data.title }}</span>
              <img class="articleIcon" v-if="data.type === 'links' || data.type === 'file'" :src="data.type === 'links' ? linkTypeIcon : fileTypeIcon" alt="" />
            </div>
            <div class="button" v-if="reNameId !== data.id">
              <LibraryOperationPopver
                :menuItems="articleOperationData"
                :height="32"
                :width="150"
                @toRename="toRename(data)"
                @toEditArticle="
                  () => {
                    useLinkHooks().handleArticleTypeLink(data, true)
                  }
                "
                @toCopyLink="toCopyLink(data)"
                @toNewTab="
                  () => {
                    useLinkHooks().handleArticleTypeLink(data, false, true)
                  }
                "
                @toCopyArticle="toHandleArticle('copy', data)"
                @toMoveArticle="toHandleArticle('move', data)"
                @toTodo="toTodo(data)"
                @toExport="toExport(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type !== 'links' && data.type !== 'title' && data.type !== 'file'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <LibraryOperationPopver
                :menuItems="linkOperationData"
                :height="32"
                :width="150"
                @toEditLink="toEditLink(data)"
                @toCopyLink="toCopyLink(data)"
                @toCopyArticle="toHandleArticle('copy', data)"
                @toMoveArticle="toHandleArticle('move', data)"
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
                @toCopyArticle="toHandleArticle('copy', data)"
                @toMoveArticle="toHandleArticle('move', data)"
                @toTodo="toTodo(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type === 'title'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <LibraryOperationPopver
                :menuItems="fileOperationData"
                :height="32"
                :width="150"
                @toRename="toRename(data)"
                @toExport="toExport(data)"
                @toCopyArticle="toHandleArticle('copy', data)"
                @toMoveArticle="toHandleArticle('move', data)"
                @toTodo="toTodo(data)"
                @toDeleteArticle="toDeleteArticle(data)"
              >
                <span class="moreIcon" v-if="data.type === 'file'" @click.stop>
                  <img src="/src/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </LibraryOperationPopver>
              <AddOperationPopver
                :menu-items="sidebarSearchMenuItemsData"
                trigger="click"
                :parent="data.id"
                @toAddDoc="handleAddArticle('文档', data)"
                @toAddSheet="handleAddArticle('表格', data)"
                @toAddPPT="handleAddArticle('幻灯片', data)"
                @toAddMindmap="handleAddArticle('脑图', data)"
                @toAddGroup="handleAddArticle('新建分组', data)"
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
  <HandleArticleDialog
    :show="showHandleArticleDialog"
    :title="handleArticleDialogTitle"
    :desc="handleArticleDialogDesc"
    :data="handleData"
    @closeDialog="showHandleArticleDialog = false"
  />
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" :type="linkType" :id="linkDialogId" @closeDialog="closeLinkDialog" />
  <ExportFileDialog :isShow="isShowExportFileDialog" @closeDialog="isShowExportFileDialog = false" :type="exportType" :id="exportId" />
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
      // padding-right: 6px;
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
        width: calc(100% - 24px);
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
          .editTitle {
            border-radius: 6px;
            border: 1px solid #00b96b;
            box-shadow: none;
            height: 24px;
            outline: none;
            padding: 1px 6px;
            box-sizing: border-box;
          }
          .articleIcon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
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

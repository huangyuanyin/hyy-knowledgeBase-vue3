<script lang="ts" setup>
import { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import miniDropDownIcon from '@/assets/icons/miniDropDownIcon.svg'
import linkTypeIcon from '@/assets/icons/linkType.svg'
import fileTypeIcon from '@/assets/icons/fileType.svg'
import { sidebarSearchMenuItemsData, directorySidebarOperationData } from '@/data/data'
import { useLinkHooks } from '@/hooks/useLink'
import { addArticleApi } from '@/api/article'

const route = useRoute()
const routeInfo = {
  route,
  router
}
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const bookTree = ref(null)
const currentNodeKey = ref(null) // 当前选中的节点
const isAllExpand = ref(true) // 是否全部展开
const group_name = ref<string>('')
const nickName = ref<string>(infoStore.currentSpaceInfo.spacekey || route.fullPath.split('/')[1])
const isShowLinkDialog = ref(false)
const isShowSelectTemDialog = ref(false)
const isShowsGroupDialog = ref(false)
const groupDialogTitle = ref('新建分组')
const groupDialogParent = ref(null)
const isLoading = ref(false)
const linkType = ref('add') // 链接弹窗类型： add edit
const parentId = ref(null) // 父级节点id
const reName = ref('')
const reNameId = ref(null)
const reFileName = ref('')
const reFileNameSuffix = ref('')
const reNameParent = ref(null)
const reFileNameId = ref(null)
const hasPermission = ref(true)
const defaultProps = {
  class: 'forumList'
} as unknown as TreeOptionProps
const inputName = ref(null)
const inputFileName = ref(null)
const isShowUploadDialog = ref(false)

const { sid = '', sname = '', gid = '', gname = '', lid = '', lname = '' } = infoStore.currentQuery || {}

watchEffect(() => {
  currentNodeKey.value = Number(infoStore.currentQuery?.aid)
  if (refreshStroe.isRefreshBookList) {
    nextTick(() => {
      handleArticleList()
    })
    refreshStroe.setRefreshBookList(false)
  }
  group_name.value = gname
  if (infoStore.currentSidebar !== 'DirectorySidebar') {
    infoStore.setCurrentArticleTreeInfo([])
  }
})

watch(
  () => infoStore.currentQuery?.aid,
  (newVal) => {
    if (newVal) {
      currentNodeKey.value = Number(infoStore.currentQuery?.aid)
      bookTree.value.setCurrentKey(newVal)
    }
  }
)

watch(
  () => infoStore.currentQuery?.lid,
  (newVal) => {
    if (newVal) {
      if (infoStore.currentSidebar === 'DirectorySidebar') {
        handleArticleList()
      }
    }
  },
  {
    immediate: true
  }
)

watch(
  () => hasPermission.value,
  (newVal) => {
    if (!newVal) {
      hasPermission.value = true
      router.replace({
        path: '/no-permission',
        query: {
          sid: infoStore.currentQuery.sid,
          sname: infoStore.currentQuery.sname,
          type: 'book'
        }
      })
    }
  },
  {
    immediate: true
  }
)

function getBookInfo() {
  return {
    id: lid,
    name: lname,
    group: gid,
    groupname: gname
  }
}

function handleAddArticle(title: string, data?) {
  const book = getBookInfo()
  useArticle().handleAddArticle({ book, title }, () => {}, data === null ? null : data?.id)
}

async function handleArticleList() {
  const { articleList, isHasPermission, getArticleList } = useArticle()
  await getArticleList(Number(lid))
  hasPermission.value = isHasPermission.value
  infoStore.currentArticleTreeInfo = articleList.value
  currentNodeKey.value = Number(infoStore.currentQuery?.aid || null)
  bookTree.value.setCurrentKey(Number(infoStore.currentQuery?.aid || null))
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
              sid: sid,
              sname: sname,
              gid: gid,
              gname: gname
            }
          })
        } else {
          router.push({
            path: `/${nickName.value}/team/book`,
            query: {
              sid: sid,
              sname: sname,
              gid: gid,
              gname: gname
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
            sid: sid,
            sname: sname
          }
        })
        break
      default:
        break
    }
  } else if (type === 'index') {
    currentNodeKey.value = null
    if (infoStore.currentSpaceType === '个人') {
      router.push({
        path: `/directory/index`,
        query: {
          sid: sid,
          sname: sname,
          lid: lid,
          lname: lname
        }
      })
    } else {
      router.push({
        path: `/${nickName.value}/directory/index`,
        query: {
          sid: sid,
          sname: sname,
          lid: lid,
          lname: lname,
          gid: gid,
          gname: gname
        }
      })
    }
  }
}

const toArticleDetail = (val) => {
  if (val.id == infoStore.currentQuery?.aid) return
  switch (val.type) {
    case 'links':
      useArticle().getArticleDetail(Number(val.id), (res: any) => {
        let link = res.body
        if (!res.body.startsWith('http://') && !res.body.startsWith('https://')) {
          link = `https://${link}`
        }
        val.open_windows === '1' ? window.open(link) : (window.location.href = link)
      })
      break
    default:
      useLinkHooks().handleArticleTypeLink(val, false)
      break
  }
}

// 重命名
const toRename = (val) => {
  reNameParent.value = val.parent
  if (val.type !== 'file') {
    reNameId.value = val.id
    reName.value = val.title
    nextTick(() => {
      inputName.value.focus()
      inputName.value.select()
    })
  } else {
    reFileNameId.value = val.id
    const suffix = val.title.split('.').pop()
    reFileNameSuffix.value = suffix
    reFileName.value = val.title.split('.').slice(0, val.title.split('.').length - 1)
    nextTick(() => {
      inputFileName.value.focus()
      inputFileName.value.select()
    })
  }
}

const handleRename = () => {
  if (!reName.value && !reFileName.value) return
  if (reFileName.value) {
    reFileName.value = reFileName.value + '.' + reFileNameSuffix.value
  }
  if (route.path.includes('/directory/index') || (reNameId.value !== Number(infoStore.currentQuery?.aid) && reFileNameId.value !== Number(infoStore.currentQuery?.aid))) {
    useArticle().handleEditArticle(reNameId.value || reFileNameId.value, reName.value || reFileName.value, () => {
      useArticle().getArticleList(Number(lid), (val: any) => {
        infoStore.currentArticleTreeInfo = val
        currentNodeKey.value = route.path.includes('/directory/index') ? null : Number(infoStore.currentQuery?.aid)
      })
    })
  } else {
    useArticle().handleEditArticle(reNameId.value || reFileNameId.value, reName.value || reFileName.value)
  }
  reNameId.value = null
  reFileNameId.value = null
  reName.value = ''
  reFileName.value = ''
}

const toAddLink = (data) => {
  parentId.value = data.id
  isShowLinkDialog.value = true
}

const closeLinkDialog = () => {
  isShowLinkDialog.value = false
  linkType.value = 'add'
}

const toImportTem = (data) => {
  parentId.value = data.id
  isShowSelectTemDialog.value = true
}

const toScroll = () => {
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

const toOpenTitleDialog = (data) => {
  isShowsGroupDialog.value = true
  groupDialogTitle.value = '新建分组'
  groupDialogParent.value = data.id
}

const toAddTitle = async (val) => {
  const params = {
    title: val[0],
    type: 'title',
    description: val[1],
    parent: groupDialogParent.value,
    book: infoStore.currentQuery.lid,
    space: infoStore.currentQuery.sid,
    public: '2' // 空间所有成员都可以访问
  }
  let res: any = await addArticleApi(params as any)
  if (res.code === 1000) {
    isShowsGroupDialog.value = false
    refreshStroe.setRefreshBookList(true)
    ElMessage.success('新建分组成功')
    const query = {
      sid,
      sname,
      lid: infoStore.currentQuery.lid,
      lname: infoStore.currentQuery.lname,
      aid: res.data.id,
      aname: res.data.title
    }
    const spaceQuery = {
      gid: infoStore.currentQuery.gid,
      gname: infoStore.currentQuery.gname
    }
    setTimeout(() => {
      router.push({
        path: `${infoStore.currentSpaceType === '个人' ? '' : `/${route.path.split('/')[1]}`}/directory/title/${''}`,
        query: {
          ...(infoStore.currentSpaceType === '个人' ? {} : spaceQuery),
          ...query
        }
      })
    }, 500)
  } else {
    ElMessage.error(res.msg)
  }
}

// 节点拖拽
// 拖拽完成时触发的事件  参数依次为：被拖拽节点、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
// 注意：目标节点是已经移动完之后的节点
const handleDrop = (draggingNode, dropNode, dropType) => {
  console.log(`output->`, draggingNode, draggingNode, dropType)
  // 定义一个空数组用于存放需要持久化到数据库的节点
  var paramData = {}
  // 当拖拽类型不为inner,说明只是在现有的节点间移动，只需要寻找目标节点的父ID，获取其对象以及所有的子节点,data为目标节点的父节点;
  // 否则，当拖拽类型为inner,说明拖拽节点成为了目标节点的子节点,只需要获取目标节点对象即可
  // 目标节点的ID
  var dropNodeId = dropNode.level == 1 && dropType != 'inner' ? null : dropNode.data.id
  // 被拖拽节点的ID
  var draggingNodeId = draggingNode.data.id
  // 被拖拽节点的name
  var draggingNodeName = draggingNode.data.title
  paramData = {
    title: draggingNodeName, // 被拖拽节点的name
    parent: dropNodeId, // 目标节点的ID
    space: sid,
    book: lid
  }
  useArticle().handleEditArticle(draggingNodeId, paramData, () => {})
}
</script>

<template>
  <div class="DirectorySidebar-wrap">
    <div class="header-box">
      <div class="header">
        <img v-if="infoStore.currentSpaceType === '个人'" class="favicon" src="/src/assets/favicon.ico" @click="toLink('back')" />
        <img v-else-if="infoStore.currentSpaceType !== '个人' && gname !== '公共区'" class="favicon" :src="infoStore.currentBookInfo.group_icon" @click="toLink('back')" />
        <img v-else-if="infoStore.currentSpaceType !== '个人' && gname === '公共区'" class="favicon" src="/src/assets/icons/spaceIcon.svg" alt="" />
        <img class="rightArrowIcon" src="/src/assets/icons/rightArrowIcon.svg" alt="" />
        <p flex-1 text-12px text="#8a8f8d" cursor-pointer max-w-18vw overflow-hidden text-ellipsis whitespace-nowrap @click="toLink('link')">
          {{ infoStore.currentSpaceType === '个人' ? '个人知识库' : `${group_name}` }}
        </p>
      </div>
      <div class="book-name">
        <div class="left">
          <img class="bookIcon" :src="infoStore.currentBookInfo.icon" alt="" />
          <div class="name">
            <p max-w-8vw overflow-hidden text-ellipsis whitespace-nowrap>{{ lname }}</p>
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
    <div class="empty" v-if="!infoStore.currentArticleTreeInfo?.length">
      <img src="@/assets/img/empty.png" alt="" />
      <div>知识库为空，你可以<span @click="handleAddArticle('文档', null)">新建文档</span></div>
    </div>
    <div class="list" v-else>
      <el-tree
        v-loading="isLoading"
        element-loading-text="文章列表加载中..."
        ref="bookTree"
        :data="infoStore.currentArticleTreeInfo"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="defaultProps"
        highlight-current
        :expand-on-click-node="false"
        :icon="customIcon"
        @node-click="toArticleDetail"
        draggable
        @node-drop="handleDrop"
      >
        <template #default="{ data }">
          <span class="list-node">
            <div class="title">
              <div v-if="reFileNameId === data.id && data.type === 'file'">
                <input
                  @click.stop
                  class="editTitle"
                  ref="inputFileName"
                  id="inputFileName"
                  v-model="reFileName"
                  type="text"
                  @blur.stop="handleRename"
                  @keyup.enter.stop="handleRename"
                />
              </div>
              <input
                @click.stop
                class="editTitle"
                ref="inputName"
                id="inputName"
                v-else-if="reNameId === data.id && data.type !== 'file'"
                v-model="reName"
                type="text"
                @blur.stop="handleRename"
                @keyup.enter.stop="handleRename"
              />
              <span v-else>{{ data.title }}</span>
              <img class="articleIcon" v-if="data.type === 'links' || data.type === 'file'" :src="data.type === 'links' ? linkTypeIcon : fileTypeIcon" alt="" />
            </div>
            <div class="button" v-if="reNameId !== data.id">
              <ArticleOeration :data="data" :row="data" @toRename="toRename" />
              <AddOperationPopver
                :menu-items="sidebarSearchMenuItemsData"
                trigger="click"
                :parent="data.id"
                @toAddDoc="handleAddArticle('文档', data)"
                @toAddSheet="handleAddArticle('表格', data)"
                @toAddPPT="handleAddArticle('幻灯片', data)"
                @toAddMindmap="handleAddArticle('脑图', data)"
                @toAddGroup="toOpenTitleDialog(data)"
                @toAddLink="toAddLink(data)"
                @toImportTem="toImportTem(data)"
                @toImportFile=";(parentId = data.id) && (isShowUploadDialog = true)"
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
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" :type="linkType" :id="null" @closeDialog="closeLinkDialog" />
  <SelectTemDialog :isShow="isShowSelectTemDialog" :parent="parentId" @closeDialog="isShowSelectTemDialog = false" />
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTitle="toAddTitle" :title="groupDialogTitle" type="title" />
  <UploadFileDialog :isShow="isShowUploadDialog" @closeDialog="isShowUploadDialog = false" :parent="parentId" />
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
    .book-name {
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
          // margin-right: 4px;
          &:hover {
            background-color: #d8dad9;
          }
        }
      }

      .list-node {
        padding-left: 4px;
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
    &:hover {
      background: #00b96b;
      border-color: #00b96b;
    }
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
.el-tree-node:focus > .el-tree-node__content {
  background-color: #fff;
}
</style>

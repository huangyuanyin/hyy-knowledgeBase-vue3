<script lang="ts" setup>
import { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import miniDropDownIcon from '@/assets/icons/miniDropDownIcon.svg'
import linkTypeIcon from '@/assets/icons/linkType.svg'
import fileTypeIcon from '@/assets/icons/fileType.svg'
import { sidebarSearchMenuItemsData, directorySidebarOperationData } from '@/data/data'
import { useLinkHooks } from '@/hooks/useLink'

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
const isLoading = ref(false)
const linkType = ref('add') // 链接弹窗类型： add edit
const parentId = ref(null) // 父级节点id
const reName = ref('')
const reNameId = ref(null)
const reNameParent = ref(null)
const hasPermission = ref(true)
const defaultProps = {
  class: 'forumList'
} as unknown as TreeOptionProps
const inputName = ref(null)

const { sid = '', sname = '', gid = '', gname = '', lid = '', lname = '' } = infoStore.currentQuery || {}

watchEffect(() => {
  currentNodeKey.value = Number(infoStore.currentQuery?.aid)
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
    refreshStroe.setRefreshArticleList(false)
  }
  nextTick(async () => {
    group_name.value = gname
    if (lid && infoStore.currentSidebar === 'DirectorySidebar') {
      handleArticleList()
    }
  })
})

watch(
  () => infoStore.currentQuery?.lid,
  (newVal) => {
    if (newVal) {
      currentNodeKey.value = Number(infoStore.currentQuery?.aid)
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
  const { articleList, currentNodeKey: node, isHasPermission, getArticleList } = useArticle()
  await getArticleList(Number(lid))
  hasPermission.value = isHasPermission.value
  infoStore.currentArticleTreeInfo = articleList.value
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
  console.log(`output->val`, infoStore.currentQuery, val)
  if (val.id == infoStore.currentQuery?.aid) return
  val.type === 'links' || val.type === 'title' ? bookTree.value.setCurrentKey(Number(infoStore.currentQuery?.aid)) : (currentNodeKey.value = val.id)
  switch (val.type) {
    case 'links':
      val.open_windows === '1' ? window.open(val.description) : (window.location.href = val.description)
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
  if (!reName.value) return
  if (route.path.includes('/directory/index') || reNameId.value !== Number(infoStore.currentQuery?.aid)) {
    useArticle().handleEditArticle(reNameId.value, reName.value, () => {
      useArticle().getArticleList(Number(lid), (val: any) => {
        infoStore.currentArticleTreeInfo = val
        route.path.includes('/directory/index') ? (currentNodeKey.value = null) : (currentNodeKey.value = Number(infoStore.currentQuery?.aid))
      })
    })
  } else {
    useArticle().handleEditArticle(reNameId.value, reName.value)
  }
  reNameId.value = null
}

const toAddLink = (data) => {
  parentId.value = data.id
  isShowLinkDialog.value = true
}

const closeLinkDialog = () => {
  isShowLinkDialog.value = false
  linkType.value = 'add'
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
</script>

<template>
  <div class="DirectorySidebar-wrap">
    <div class="header-box">
      <div class="header">
        <img v-if="infoStore.currentSpaceType === '个人'" class="favicon" src="/src/assets/favicon.ico" @click="toLink('back')" />
        <img v-else-if="infoStore.currentSpaceType !== '个人' && gname !== '公共区'" class="favicon" :src="infoStore.currentBookInfo.group_icon" @click="toLink('back')" />
        <img v-else-if="infoStore.currentSpaceType !== '个人' && gname === '公共区'" class="favicon" src="/src/assets/icons/spaceIcon.svg" alt="" />
        <img class="rightArrowIcon" src="/src/assets/icons/rightArrowIcon.svg" alt="" />
        <span @click="toLink('link')">{{ infoStore.currentSpaceType === '个人' ? '个人知识库' : `${group_name}` }}</span>
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
        element-loading-text="文章加载中..."
        ref="bookTree"
        :data="infoStore.currentArticleTreeInfo"
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
              <input
                @click.stop
                class="editTitle"
                ref="inputName"
                id="inputName"
                v-if="reNameId === data.id"
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
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" :type="linkType" :id="null" @closeDialog="closeLinkDialog" />
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

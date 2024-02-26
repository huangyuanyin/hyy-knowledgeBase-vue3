<script lang="ts" setup>
import limitsIcon from '@/assets/icons/limitsIcon.svg'
import renameIcon from '@/assets/icons/renameIcon.svg'
import menuIcon from '@/assets/icons/menuIcon.svg'
import deleteIcon from '@/assets/icons/deleteIcon.svg'
// import starOutlineIcon from '@/assets/icons/starOutlineIcon.svg'
// import swipOutlineIcon from '@/assets/icons/swipOutlineIcon.svg'
// import newTabOutlineIcon from '@/assets/icons/newTabOutlineIcon.svg'
import settingIcon from '@/assets/icons/team/settingIcon.svg'
import editIcon from '@/assets/icons/team/editIcon.svg'
import privateIcon from '@/assets/icons/privateIcon.svg'
import empty from '@/assets/img/empty.png'
import addIcon from '@/assets/icons/addIcon.svg'
import addIcon_hover from '@/assets/icons/addIcon_hover.svg'
import articleIcon from '@/assets/icons/articleIcon.svg'
import { contentType } from '@/data/data'
import { addQuickLinksApi, deleteQuickLinksApi } from '@/api/quickLinks'
import { ArticleInfo } from '@/type/article'

const props = defineProps({
  header: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  }
})

const route = useRoute()
const router = useRouter()
const routeInfo = { route, router }
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const isShowTeamDialog = ref(false)
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})
const libraryOperationData = [
  { type: 'item', icon: limitsIcon, label: '权限', nick: 'toPermission' },
  { type: 'item', icon: renameIcon, label: '重命名', nick: 'toRename' },
  { type: 'item', icon: menuIcon, label: '更多设置', nick: 'toMoreSetting' },
  { type: 'divider' },
  { type: 'item', icon: deleteIcon, label: '删除', nick: 'toDeleteBook' }
]
// const editTableOperation = [
//   {
//     type: 'item',
//     label: '收藏',
//     icon: starOutlineIcon
//   },
//   {
//     type: 'item',
//     label: '移除记录',
//     icon: swipOutlineIcon
//   },
//   {
//     type: 'item',
//     label: '浏览器打开',
//     icon: newTabOutlineIcon
//   }
// ]
const commonTeamData = [
  { type: 'item', icon: settingIcon, label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: editIcon, label: '退出团队', nick: 'toQuitTeam' }
]

const hoveredDocument = ref<number | null>(null)

const header = computed(() => {
  return props.header.map((item) => ({ label: item }))
})

const handleMouseEnter = (documentId: number): void => {
  if (hoveredDocument.value !== documentId) {
    hoveredDocument.value = documentId
  }
}

const handleMouseLeave = (documentId: number): void => {
  if (hoveredDocument.value === documentId) {
    hoveredDocument.value = null
  }
}

// 添加/移除常用
const toQuickLink = (operation, val, type) => {
  if (operation === 'add') {
    const params = {
      title: val.groupname || val.name,
      target_id: String(val.id),
      target_type: type,
      slug: val.slug,
      space: val.space,
      user
    }
    addQuickLinks(params, type)
  } else {
    const params = {
      space: val.space,
      user
    }
    deleteQuickLinks(val.is_common_id, params, type)
  }
}

const deleteQuickLinks = async (id, params, type) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    if (type === 'book') {
      ElMessage.success('移除成功')
      refreshStroe.setRefreshQuickBookList(true)
    } else {
      ElMessage.success('移除成功')
      refreshStroe.setRefreshQuickTeamList(true)
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const addQuickLinks = async (params, type) => {
  let res = await addQuickLinksApi(params)
  if (res.code === 1000) {
    if (type === 'book') {
      ElMessage.success('添加成功')
      refreshStroe.setRefreshQuickBookList(true)
    } else {
      ElMessage.success('添加成功')
      refreshStroe.setRefreshQuickTeamList(true)
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const toLink = (val, type) => {
  if (type === 'team') {
    useTeamPermission(route, router, val)
  } else if (type === 'library') {
    const baseUrl = `${infoStore.currentSpaceType === '个人' ? '' : `/${infoStore.currentSpaceInfo.spacekey}`}/directory/index`
    router.push({
      path: baseUrl,
      query: {
        sid: val.space,
        sname: infoStore.currentQuery?.sname,
        lid: val.id,
        lname: val.name,
        gid: val.group,
        gname: val.group_name
      }
    })
  } else if (type === 'star') {
    const baseUrl = `${infoStore.currentSpaceType === '个人' ? '' : `/${infoStore.currentSpaceInfo.spacekey}`}/directory/${val.target_type}`
    router.push({
      path: baseUrl,
      query: {
        sid: val.space,
        sname: infoStore.currentQuery?.sname,
        lid: val.owner_ship.book_id,
        lname: val.owner_ship.book_name,
        gid: val.owner_ship.group_id,
        gname: val.owner_ship.group_name,
        aid: val.target_id,
        aname: val.target_name
      }
    })
  }
}

const toHandle = (item: any, type: string) => {
  switch (type) {
    case '编辑':
      const baseUrl = `${infoStore.currentSpaceType === '个人' ? '' : `/${infoStore.currentSpaceInfo.spacekey}`}/directory/${item.target_type}`
      router.push({
        path: baseUrl,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          lid: item.article.book_id,
          lname: item.article.book_name,
          gid: item.article.group_id,
          gname: item.article.group_name,
          aid: item.target_id,
          aname: item.article.title
        }
      })
      break
    case '已收藏':
    case '收藏':
      if (!(infoStore.currentArticleInfo as ArticleInfo).marked) {
        // addMarks()
      }
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}

const toMoreSetting = (val) => {
  console.log(`output->val`, val)
  useLink(routeInfo, 'bookSet', val)
}

const toPermission = (val) => {
  useLink(routeInfo, 'bookPermission', val)
}

const toRename = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toDeleteBook = (val) => {
  deleteInfo.value = val
  isShowsDeleteDialog.value = true
}

const toTeamSetting = (val: any) => {
  useLink(routeInfo, 'teamSet', val)
}

const toQuitTeam = (val: any) => {
  useLink(routeInfo, 'teamQuit', val)
}

const cancelMark = () => {
  refreshStroe.setRefreshMark(true)
}
</script>

<template>
  <table class="TableComp_wrap">
    <thead v-if="header.length">
      <tr>
        <th v-for="(item, index) in header" :key="'header' + index">{{ item.label }}</th>
      </tr>
    </thead>
    <template v-if="props.data.length">
      <tbody v-if="['updateDoc', 'viewDoc'].includes(props.type) && props.data.length">
        <tr class="docItem" v-for="document in (props.data as any)" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title" @click="toHandle(document, '编辑')">
            <div>
              <img :src="contentType[document.target_type]" alt="" />
              <div class="item-title-right">
                <el-tooltip effect="light" :content="document.article.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <p max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.article.title }}</p>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top" :show-arrow="false">
                  <span class="editIcon">
                    <img v-show="hoveredDocument === document.id" src="@/assets/icons/editIcon.svg" alt="" />
                  </span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user">
            <span class="username">{{ document.creator_name }}</span>
            <span class="divider">/</span>
            <span class="library">{{ document.article.book_name }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.update_datetime }}</span>
          </td>
          <!-- <td class="item-operation">
            <el-popover
              ref="docOperationPopver"
              popper-class="docOperationPopver"
              placement="bottom-start"
              width="126"
              trigger="click"
              :show-after="100"
              :hide-after="100"
              :show-arrow="false"
            >
              <template #reference>
                <span>
                  <img v-if="['updateDoc', 'viewDoc'].includes(props.type)" src="@/assets/icons/moreIcon1_after.svg" alt="" />
                </span>
              </template>
              <ul>
                <template v-for="(item, _index) in editTableOperation" :key="'menuItems' + _index">
                  <StarPopver @cancelMark="cancelMark" :startId="document.mark_id" :tag_mark="document.tag_mark" type="star">
                    <li class="operation_item" v-if="item.label === '收藏'" :style="{ height: '40px', 'line-height': '40px' }" @click="toHandle(document, '收藏')">
                      <img v-if="item.icon" :src="item.icon as string" alt="" />
                      <span :style="{ color: '#262626' }">{{ item.label }}</span>
                    </li>
                  </StarPopver>
                  <li class="operation_item" v-if="item.label !== '收藏'" :style="{ height: '40px', 'line-height': '40px' }" @click="toHandle(document, item.label)">
                    <img v-if="item.icon" :src="item.icon as string" alt="" />
                    <span :style="{ color: item.label === '删除' ? '#df2a3f' : '#262626' }">{{ item.label }}</span>
                  </li>
                </template>
              </ul>
            </el-popover>
          </td> -->
        </tr>
      </tbody>
      <tbody v-if="props.type === 'star'">
        <tr class="docItem" v-for="document in (props.data as any)" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.target_type === 'book' ? document.owner_ship.book_icon : articleIcon" alt="" />
              <div class="item-title-right" @click="toLink(document, 'star')">
                <el-tooltip effect="light" :content="document.target_name" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <p max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.target_name }}</p>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user" v-if="document.target_type === 'book'">
            <span class="username">{{ document.owner_ship.group_name }}</span>
          </td>
          <td class="item-user" v-else>
            <span class="username">{{ document.owner_ship.group_name }}</span>
            <span class="divider">/</span>
            <span class="library">{{ document.owner_ship.book_name }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.create_datetime }}</span>
          </td>
          <td class="item-operation">
            <StarPopver @cancelMark="cancelMark" :startId="document.id" :tag_mark="document.tags_id" :target_id="document.target_id" type="star">
              <span v-if="props.type === 'star'"><img src="@/assets/icons/startIcon_select.svg" alt="" /></span>
            </StarPopver>
          </td>
        </tr>
      </tbody>
      <tbody v-if="props.type === 'library'">
        <tr class="docItem" v-for="document in (props.data as any)" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon" alt="" />
              <div class="item-title-right" @click="toLink(document, 'library')">
                <el-tooltip effect="light" :content="document.name" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.name }}</span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user">
            <el-tooltip effect="light" :content="document.group_name" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
              <p class="username" max-w-26vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.group_name }}</p>
            </el-tooltip>
          </td>
          <td class="item-user">
            <span class="username">{{ document.creator_name }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.update_datetime }}</span>
          </td>
          <td class="item-operation more">
            <el-tooltip effect="dark" :content="document.is_common_id ? '取消常用' : '添加常用'" :offset="6" placement="top" :show-arrow="false">
              <span class="pinIcon" v-if="document.is_common_id">
                <img src="@/assets/icons/pinIcon.svg" alt="" @click="toQuickLink('delete', document, 'book')" />
              </span>
              <span class="pinIcon" v-else>
                <img src="@/assets/icons/pinOutIcon.svg" alt="" @click="toQuickLink('add', document, 'book')" />
              </span>
            </el-tooltip>
            <LibraryOperationPopver
              :menuItems="libraryOperationData"
              :width="126"
              @toRename="toRename(document)"
              @toPermission="toPermission(document)"
              @toMoreSetting="toMoreSetting(document)"
              @toDeleteBook="toDeleteBook(document)"
            >
              <span>
                <img v-show="hoveredDocument === document.id" src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </span>
            </LibraryOperationPopver>
          </td>
        </tr>
      </tbody>
      <tbody v-if="props.type === 'team'">
        <tr class="docItem" v-for="document in (props.data as any)" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon" alt="" />
              <div class="item-title-right" @click="toLink(document, 'team')">
                <el-tooltip effect="light" :content="document.groupname" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <p max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.groupname }}</p>
                </el-tooltip>
              </div>
              <el-tooltip effect="dark" :content="'仅团队成员可访问'" placement="top" :show-arrow="false">
                <span class="perIcon">
                  <img v-if="document.public === '0'" :src="privateIcon" alt="" />
                </span>
              </el-tooltip>
            </div>
          </td>
          <td class="item-desc">
            <el-tooltip effect="light" :content="document.description" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
              <p class="desc" max-w-26vw overflow-hidden text-ellipsis whitespace-nowrap>{{ document.description }}</p>
            </el-tooltip>
          </td>
          <td class="item-user">
            <span class="username">{{ document.member_count + 1 }} 人</span>
          </td>
          <td class="item-user">
            <span>{{ document.creator_name }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.create_datetime }}</span>
          </td>
          <td class="item-operation more">
            <el-tooltip effect="dark" :content="document.is_common_id ? '取消常用' : '设为常用'" :offset="6" placement="top" :show-arrow="false">
              <span class="pinIcon" v-if="document.is_common_id">
                <img src="@/assets/icons/pinIcon.svg" alt="" @click="toQuickLink('delete', document, 'group')" />
              </span>
              <span class="pinIcon" v-else>
                <img src="@/assets/icons/pinOutIcon.svg" alt="" @click="toQuickLink('add', document, 'group')" />
              </span>
            </el-tooltip>
            <LibraryOperationPopver :menuItems="commonTeamData" :height="40" @toTeamSetting="toTeamSetting(document)" @toQuitTeam="toQuitTeam(document)">
              <span class="moreIcon">
                <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </span>
            </LibraryOperationPopver>
          </td>
        </tr>
      </tbody>
    </template>
  </table>
  <div v-if="['updateDoc', 'viewDoc'].includes(props.type) && !props.data.length">
    <Empty height="400px" :text="props.type === 'updateDoc' ? '你最近编辑的内容将会出现在这里' : '你最近浏览的内容将会出现在这里'" :img="empty" />
  </div>
  <div class="empty" v-if="!props.data.length && props.type === 'team'">
    <img class="emptyImg" :src="empty" alt="" />
    <p>团队可以是实际存在的部门，也可以是虚拟的项目组，空间中可以创建不同类型的团队完成日常工作与协同。</p>
    <el-button @click="isShowTeamDialog = true">
      <template #icon>
        <img class="addIcon" :src="addIcon" alt="" />
        <img class="addIcon_hover" :src="addIcon_hover" alt="" />
      </template>
      新建团队
    </el-button>
  </div>
  <TeamDialog :isShow="isShowTeamDialog" @closeDialog="isShowTeamDialog = false" />
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.TableComp_wrap {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    th {
      padding: 8px 0;
      font-size: 14px;
      color: #8a8f8d;
      text-align: left;
      box-sizing: border-box;
    }
  }
  .docItem {
    height: 65px;
    &:hover {
      background-color: #fafafa;
    }
    td {
      padding: 16px 1px;
      box-sizing: border-box;
    }
    .item-title {
      min-width: 200px;
      div {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          min-width: 24px;
          height: 24px;
          margin-right: 16px;
        }
        .item-title-right {
          display: flex;
          align-items: center;
          max-width: 100%;
          p,
          span {
            font-size: 14px;
            line-height: 32px;
            color: #262626;
            cursor: pointer;
          }
          .editIcon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            margin-left: 12px;
            img {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
      }
      .perIcon {
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 14px;
        height: 22px;
        margin-left: 4px;
        line-height: 22px;
        img {
          width: 14px;
          height: 14px;
          min-width: 14px;
        }
      }
    }
    .item-user {
      min-width: 100px;
      font-size: 14px;
      color: #8a8f8d;
      height: 65px;
      box-sizing: border-box;
      .library,
      .username {
        &:hover {
          color: #262626;
          cursor: pointer;
        }
      }
      .divider {
        margin: 0 4px;
      }
    }
    .item-desc {
      font-size: 14px;
      color: #8a8f8d;
      height: 65px;
      box-sizing: border-box;
      min-width: 200px;
    }
    .item-time {
      min-width: 120px;
      font-size: 14px;
      color: #8a8f8d;
      min-width: 200px;
    }
    .item-operation {
      span {
        cursor: pointer;
        width: 34px;
        min-width: 34px;
      }
    }
    .more {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 20px;
      span {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        max-height: 28px;
        &:hover {
          background-color: #e7e9e8;
        }
      }
    }
  }
}
.empty {
  padding: 16px;
  height: 50vh;
  width: 70vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 100px);
  .emptyImg {
    width: 120px;
    height: 101px;
  }
  p {
    width: 340px;
    margin-top: 16px;
    font-size: 14px;
    color: #8a8f8d;
  }
  .el-button {
    border-radius: 6px;
    margin-top: 20px;
    .addIcon {
      display: flex;
    }
    .addIcon_hover {
      display: none;
    }
    &:hover {
      color: #009456;
      border-color: #009456;
      background-color: #fff;
      .addIcon {
        display: none;
      }
      .addIcon_hover {
        display: flex;
      }
    }
  }
}

.docOperationPopver {
  ul {
    list-style: none;
    .operation_item {
      box-sizing: border-box;
      padding: 6px 10px !important;
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      span {
        margin-left: 8px;
        font-size: 14px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
        cursor: pointer;
      }
    }
    .divider {
      margin: 4px 12px;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>

<style lang="scss">
.docOperationPopver {
  padding: 0 !important;
  min-width: 110px !important;
  border-radius: 8px !important;
}
</style>

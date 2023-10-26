<script lang="ts" setup>
import { addQuickLinksApi, deleteQuickLinksApi } from '@/api/quickLinks'

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
const infoStore = useInfoStore()
const userStore = useUserStore()
const listStore = useListStore()
const refreshStroe = useRefreshStore()
const isShowTeamDialog = ref(false)
const libraryOperationData = [
  { type: 'item', icon: '/src/assets/icons/limitsIcon.svg', label: '权限' },
  { type: 'item', icon: '/src/assets/icons/renameIcon.svg', label: '重命名' },
  { type: 'item', icon: '/src/assets/icons/menuIcon.svg', label: '更多设置' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/deleteIcon.svg', label: '删除' }
]
const editTableOperation = [
  {
    type: 'item',
    label: '收藏',
    icon: '/src/assets/icons/starOutlineIcon.svg'
  },
  {
    type: 'item',
    label: '移除记录',
    icon: '/src/assets/icons/swipOutlineIcon.svg'
  },
  {
    type: 'item',
    label: '浏览器打开',
    icon: '/src/assets/icons/newTabOutlineIcon.svg'
  }
]
const commonTeamData = [
  { type: 'item', icon: '/src/assets/icons/team/settingIcon.svg', label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: '/src/assets/icons/team/editIcon.svg', label: '退出团队', nick: 'quitTeam' }
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
      user: JSON.parse(localStorage.getItem('user')).userInfo.username || '',
      space: val.space
    }
    addQuickLinks(params, type)
  } else {
    const params = {
      user: userStore.userInfo.username,
      space: val.space
    }
    deleteQuickLinks(val.is_common_id, params, type)
  }
}

const deleteQuickLinks = async (id, params, type) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    if (type === 'book') {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('移除成功')
      refreshStroe.setIsGetQuickList(true)
    } else {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('移除成功')
      refreshStroe.setIsGetTeamQuickList(true)
    }
  }
}

const addQuickLinks = async (params, type) => {
  let res = await addQuickLinksApi(params)
  if (res.code === 1000) {
    if (type === 'book') {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('添加成功')
      refreshStroe.setIsGetQuickList(true)
    } else {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('添加成功')
      refreshStroe.setIsGetTeamQuickList(true)
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const toLink = (val, type) => {
  if (type === 'team') {
    router.push({
      path: `/${infoStore.currentSpaceName}/team/book`,
      query: {
        sid: val.space,
        sname: route.query.sname,
        gid: val.id,
        gname: val.groupname
      }
    })
  } else if (type === 'library') {
    router.push({
      path: `/${infoStore.currentSpaceName}/directory/index`,
      query: {
        sid: val.space,
        sname: route.query.sname,
        lid: val.id,
        lname: val.name
      }
    })
  }
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
      <tbody v-if="props.type === 'dashboard'">
        <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon" alt="" />
              <div class="item-title-right">
                <el-tooltip effect="light" :content="document.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span>{{ document.title }}</span>
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
            <span class="username">{{ document.username }}</span>
            <span class="divider">/</span>
            <span class="library">{{ document.library }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.time }}</span>
          </td>
          <td class="item-operation">
            <LibraryOperationPopver :menuItems="editTableOperation" :width="126">
              <span>
                <img v-show="hoveredDocument === document.id" src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </span>
            </LibraryOperationPopver>
          </td>
        </tr>
      </tbody>
      <tbody v-if="props.type === 'star'">
        <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon" alt="" />
              <div class="item-title-right">
                <el-tooltip effect="light" :content="document.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span>{{ document.title }}</span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user">
            <span class="username">{{ document.username }}</span>
            <span class="divider">/</span>
            <span class="library">{{ document.library }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.time }}</span>
          </td>
          <td class="item-operation">
            <span v-if="props.type === 'star'"><img src="@/assets/icons/startIcon_select.svg" alt="" /></span>
          </td>
        </tr>
      </tbody>
      <tbody v-if="props.type === 'library'">
        <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon || '/src/assets/icons/bookIcon.svg'" alt="" />
              <div class="item-title-right" @click="toLink(document, 'library')">
                <el-tooltip effect="light" :content="document.name" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span>{{ document.name }}</span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user">
            <span class="username">{{ document.group_name }}</span>
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
            <LibraryOperationPopver :menuItems="libraryOperationData" :width="126">
              <span>
                <img v-show="hoveredDocument === document.id" src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </span>
            </LibraryOperationPopver>
          </td>
        </tr>
      </tbody>
      <tbody v-if="props.type === 'team'">
        <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon || '/src/assets/icons/teamIcon.svg'" alt="" />
              <div class="item-title-right" @click="toLink(document, 'team')">
                <el-tooltip effect="light" :content="document.groupname" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span>{{ document.groupname }}</span>
                </el-tooltip>
              </div>
              <el-tooltip effect="dark" :content="'仅团队成员可访问'" placement="top" :show-arrow="false">
                <span class="perIcon">
                  <img v-if="document.public === '0'" src="/src/assets/icons/privateIcon.svg" alt="" />
                </span>
              </el-tooltip>
            </div>
          </td>
          <td class="item-desc">
            <span class="desc">{{ document.description }}</span>
          </td>
          <td class="item-user">
            <span class="username">{{ document.member_count }} 人</span>
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
            <LibraryOperationPopver :menuItems="commonTeamData" :height="40">
              <span class="moreIcon">
                <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </span>
            </LibraryOperationPopver>
          </td>
        </tr>
      </tbody>
    </template>
  </table>
  <div class="empty" v-if="!props.data.length && props.type === 'team'">
    <img class="emptyImg" src="/src/assets/img/empty.png" alt="" />
    <p>团队可以是实际存在的部门，也可以是虚拟的项目组，空间中可以创建不同类型的团队完成日常工作与协同。</p>
    <el-button @click="isShowTeamDialog = true">
      <template #icon>
        <img class="addIcon" src="/src/assets/icons/addIcon.svg" alt="" />
        <img class="addIcon_hover" src="/src/assets/icons/addIcon_hover.svg" alt="" />
      </template>
      新建团队
    </el-button>
  </div>
  <TeamDialog :isShow="isShowTeamDialog" @closeDialog="isShowTeamDialog = false" />
</template>

<style lang="scss" scoped>
.TableComp_wrap {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  tr {
    th {
      padding: 8px 0;
      font-size: 14px;
      color: #8a8f8d;
      text-align: left;
    }
  }
  .docItem {
    height: 65px;
    &:hover {
      background-color: #fafafa;
    }
    td {
      padding: 16px 1px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
      width: 100px;
      span {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        max-height: 26px;
        &:hover {
          background-color: #e7e9e8;
        }
      }
      .moreIcon {
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
</style>

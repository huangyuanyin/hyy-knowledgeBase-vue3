<script lang="ts" setup>
import privateIcon from '@/assets/icons/privateIcon.svg'
import publicIcon from '@/assets/icons/publicIcon.svg'
import settingIcon from '@/assets/icons/settingIcon.svg'
import moreIcon2 from '@/assets/icons/moreIcon2.svg'
import { libraryOperationData, teamOperationData, moreOperationData, menuItemsData, spaceMenuItemsData } from '@/data/data'
import { MenuItem } from '@/type/operationPopoverType'
import { contentItemsData, moreMenuItemsData } from '@/data/data'
import { deleteQuickLinksApi } from '@/api/quickLinks'
// import { getTeamMemberApi } from '@/api/member'
import { user } from '@/data/data'

interface ContentItem {
  title: string
  type: string
  icon: string
  emptyText: string
  isExpand: boolean
  libraryList: any
}

interface MenuItems {
  index: string
  icon: string
  label: string
}

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItems[]>,
    default: () => contentItemsData
  },
  contentItems: {
    type: Array as PropType<ContentItem[]>,
    default: () => contentItemsData
  },
  moreMenuItems: {
    type: Array as PropType<MenuItem[]>,
    default: () => moreMenuItemsData
  }
})

const route = useRoute()
const routeInfo = { route, router }
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const icon = ref('')
const state = reactive({
  headerActive: null,
  currentGroup: null,
  operatData: []
})
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})
const typeIcon = {
  '0': privateIcon,
  '1': publicIcon
}

watchEffect(() => {
  if (infoStore.currentSpaceType === '个人') {
    icon.value = 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar
  } else {
    icon.value = infoStore.currentSpaceInfo.icon
  }
})

watch(
  () => infoStore.currentQuery?.gid,
  () => {
    if (infoStore.currentQuery?.gname === '公共区') {
      state.currentGroup = null
    } else {
      state.currentGroup = infoStore.currentQuery?.gid
    }
  }
)

watch(
  () => route.path,
  async () => {
    infoStore.setCurrentSidebar(route.meta.asideComponent.toString())
    if (route.meta.asideComponent === 'SpaceSidebar') {
      state.operatData = spaceMenuItemsData
      switch (infoStore.currentMenu) {
        case 'library':
          state.headerActive = 0
          break
        case 'team':
          if (route.path.split('/').length >= 4 && route.path.split('/')[2] === 'team') {
            state.headerActive = null
            state.currentGroup = infoStore.currentQuery?.gid
          } else {
            state.headerActive = 1
          }
          break
        default:
          state.headerActive = null
          break
      }
    } else {
      state.operatData = menuItemsData
      state.headerActive = infoStore.currentMenu === 'library' ? 0 : null
    }
  },
  {
    immediate: true
  }
)

const toLink = (type) => {
  const query = {
    sid: infoStore.currentQuery?.sid,
    sname: infoStore.currentQuery?.sname
  }
  switch (infoStore.currentSidebar) {
    case 'Sidebar':
      router.push({ name: 'Library' })
      break
    case 'SpaceSidebar':
      if (type === 'team') {
        router.push({
          name: 'Space-Team',
          query
        })
      } else {
        router.push({
          name: 'Space-Library',
          query
        })
      }
      break
    default:
      break
  }
}

const handleClickLibrary = (val: any) => {
  if (val.target_type === 'group') {
    getTeamMember(val)
    state.currentGroup = val.target_id
    refreshStroe.setRefreshBookStacks(true)
  } else {
    const query = {
      lid: val.target_id,
      lname: val.name || val.title,
      sid: infoStore.currentSpaceInfo.id,
      sname: infoStore.currentSpaceInfo.spacename
    }
    switch (infoStore.currentSidebar) {
      case 'Sidebar':
        router.push({ path: '/directory/index', query })
        break
      case 'SpaceSidebar':
        router.push({
          path: `/${infoStore.currentSpaceInfo.spacekey}/directory/index`,
          query: {
            ...query,
            gid: val.group_id,
            gname: val.group_name
          }
        })
        break
      default:
        break
    }
  }
}

const toBook = (val) => {
  router.push({
    path: `/${infoStore.currentSpaceInfo.spacekey}/team/book`,
    query: {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname,
      gname: val.title,
      gid: val.target_id
    }
  })
}

const toTopic = (val) => {
  router.push({
    path: `/${infoStore.currentSpaceInfo.spacekey}/team/topic`,
    query: {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname,
      gname: val.title,
      gid: val.target_id
    }
  })
}

const getTeamMember = async (val) => {
  router.push({
    path: `/${infoStore.currentSpaceInfo.spacekey}/team/book`,
    query: {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname,
      gid: val.target_id,
      gname: val.title
    }
  })
}

const toReminderFree = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toSpaceManager = () => {
  router.push({
    path: `/${infoStore.currentSpaceInfo.spacekey}/organize/dashboard`,
    query: {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname
    }
  })
}

const toRemoveCommon = (val) => {
  const params = {
    space: val.space,
    user
  }
  deleteQuickLinks(val.target_type, val.id, params)
}

const deleteQuickLinks = async (type, id, params) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('移除成功')
    type === 'group' ? refreshStroe.setRefreshQuickTeamList(true) : refreshStroe.setRefreshQuickBookList(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const toDeleteLibrary = (item: any) => {
  isShowsDeleteDialog.value = true
  deleteInfo.value = item
  deleteInfo.value.name = item.title
  deleteInfo.value.id = item.target_id
  deleteInfo.value.slug = item.target_slug
}

const toTeamSetting = (val) => {
  useLink(routeInfo, 'comTeamSet', val)
}

const toQuitTeam = (val) => {
  useLink(routeInfo, 'comTeamQuit', val)
}

const toMoreSetting = (val) => {
  useLink(routeInfo, 'comBookSet', val)
}

const toPermission = (val) => {
  useLink(routeInfo, 'comBookPermission', val)
}

const getSpacesDeatil = async () => {
  useSpace().getSpaceInfo(Number(infoStore.currentQuery?.sid), (res: any) => {
    if (Reflect.ownKeys(res).length === 0) return
    icon.value = res.icon
  })
}

const toExpandCollapse = (opera, type, data) => {
  if (opera === 'collapse') {
    data.isExpand = false
    type === 'book' ? localStorage.setItem('bookIsExpand', 'false') : localStorage.setItem('teamIsExpand', 'false')
  } else {
    data.isExpand = true
    type === 'book' ? localStorage.setItem('bookIsExpand', 'true') : localStorage.setItem('teamIsExpand', 'true')
  }
}

onMounted(async () => {
  if (infoStore.currentSpaceType === '组织') {
    await getSpacesDeatil()
  }
})
</script>

<template>
  <div class="SiderbarComp-wrap">
    <div class="first-comp">
      <div class="top-box">
        <SidebarUserItem :icon="icon" />
        <SidebarSearch :menuItems="state.operatData" />
        <SidebarMenuItem :menuItems="menuItems" />
      </div>
      <div class="content-box">
        <div :class="[item.title === '团队' ? 'team' : 'library']" v-for="(item, index) in props.contentItems" :key="index">
          <div :class="['header', state.headerActive === index ? 'header-active' : '']" @click="toLink(item.type)">
            <div class="header-left">
              <span class="header-icon expand" v-if="item.isExpand" @click.stop="toExpandCollapse('collapse', item.title === '团队' ? 'team' : 'book', item)">
                <i-ep-CaretRight />
              </span>
              <span class="header-icon" v-else @click.stop="toExpandCollapse('expand', item.title === '团队' ? 'team' : 'book', item)"><i-ep-CaretRight /></span>
              <span class="header-title">{{ item.title }}</span>
            </div>
            <div class="header-right"><i-ep-ArrowRight /></div>
          </div>
          <el-tree
            v-if="item.isExpand"
            :data="item.libraryList"
            node-key="target_id"
            :current-node-key="state.currentGroup"
            default-expand-all
            :highlight-current="item.title === '团队' ? true : false"
            :expand-on-click-node="false"
            @node-click="handleClickLibrary"
            :empty-text="item.emptyText"
          >
            <template #default="{ data }">
              <span :class="['custom-tree-node']">
                <div style="display: flex; align-items: center; flex: 1">
                  <img :src="data.icon" alt="" />
                  <el-tooltip effect="light" :content="data.name || data.groupname || data.title" placement="bottom-end" :hide-after="0" :show-after="1000" :show-arrow="false">
                    <p class="title">{{ data.name || data.groupname || data.title }}</p>
                  </el-tooltip>
                  <span class="type-icon">
                    <img :src="typeIcon[data.public] || privateIcon" alt="" />
                  </span>
                </div>
                <LibraryOperationPopver
                  :menuItems="item.type !== 'team' ? libraryOperationData : teamOperationData"
                  @toBook="toBook(data)"
                  @toTopic="toTopic(data)"
                  @toReminderFree="toReminderFree(data)"
                  @toDeleteLibrary="toDeleteLibrary(data)"
                  @toRemoveCommon="toRemoveCommon(data)"
                  @toTeamSetting="toTeamSetting(data)"
                  @toQuitTeam="toQuitTeam(data)"
                  @toPermission="toPermission(data)"
                  @toMoreSetting="toMoreSetting(data)"
                >
                  <span class="more-icon" @click.stop>
                    <img src="@/assets/icons/moreIcon1.svg" alt="" />
                  </span>
                </LibraryOperationPopver>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="divider" v-if="infoStore.currentSpaceType === '组织'"></div>
    <div class="last-comp">
      <div class="more-item" v-if="infoStore.currentSpaceType === '组织' && infoStore.isSpaceAdmin === 'true'" @click="toSpaceManager">
        <img :src="settingIcon" alt="" />
        <span>空间管理</span>
      </div>
      <MorePopver :menuItems="moreOperationData">
        <div class="more-item">
          <img :src="moreIcon2" alt="" />
          <span>更多</span>
        </div>
      </MorePopver>
    </div>
  </div>
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.SiderbarComp-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px 0px 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .first-comp {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .top-box {
      padding-right: 12px;
      display: flex;
      flex-direction: column;
    }
    .content-box {
      flex: 1;
      overflow-y: scroll;
      padding-right: 3px;
      .library,
      .team {
        margin-top: 14px;
        background-color: #fafafa;
        flex: 1;
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 32px;
          margin: 4px 0;
          &:hover {
            cursor: pointer;
            background-color: #eff0f0;
            border-radius: 6px;
          }
          .header-left {
            display: flex;
            align-items: center;
            justify-content: center;
            .header-icon {
              width: 26px;
              height: 26px;
              cursor: pointer;
              margin-right: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 4px;
              color: #8a8f8d;
              font-size: 14px;
              &:hover {
                border-radius: 6px;
                background-color: #d8dad9;
                color: #262626;
              }
            }
            .expand {
              transform: rotate(90deg);
            }
            .header-title {
              font-size: 14px;
              color: #262626;
            }
          }
          .header-right {
            width: 14px;
            height: 14px;
            line-height: 14px;
            margin-right: 6px;
            svg {
              width: 100%;
              height: 100%;
              color: #8a8f8d;
            }
          }
        }
        .header-active {
          background-color: #eff0f0;
          border-radius: 6px;
        }
        :deep(.el-tree) {
          background-color: #fafafa;
          .el-tree__empty-text {
            width: 100%;
          }
        }
        :deep(.el-tree-node__content) {
          height: 32px;
          &:hover {
            background-color: #eff0f0;
          }
        }
        :deep(.el-tree-node__expand-icon) {
          display: none;
        }
        :deep(.el-tree-node__content) {
          margin: 4px 0;
          padding-left: 25px !important;
          padding-right: 4px !important;
          box-sizing: border-box;
          width: 100% !important;
          border-radius: 6px;
        }
        .custom-tree-node {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          &:hover {
            .more-icon {
              display: flex;
            }
          }
          .title {
            margin-left: 6px;
            font-size: 14px;
            color: #585a5a;
            max-width: 140px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
          }
          .type-icon {
            margin-left: 4px;
            display: flex;
            align-items: center;
          }
          .more-icon {
            width: 20px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8a8f8d;
            display: none;
            &:hover {
              background-color: #d8dad9;
              border-radius: 6px;
              color: #262626;
              img {
                width: 16px;
                height: 16px;
                min-width: 16px;
                content: url('@/assets/icons/moreIcon1_after.svg');
              }
            }
          }
        }
      }
      .team {
        :deep(.is-current) {
          .el-tree-node__content {
            background-color: #eff0f0 !important;
          }
        }
      }
      &::-webkit-scrollbar {
        max-height: 60px;
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        height: 60px;
        border-radius: 30px;
        width: 3px;
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
  .divider {
    border-top: 1px solid #e7e9e8;
    margin-left: -12px;
  }
  .last-comp {
    list-style: none;
    margin: 9px 0 7px 0;
    padding-right: 12px;
    box-sizing: border-box;
    width: 100%;
    .more-item {
      display: flex;
      align-items: center;
      padding: 0 4px 0 10px;
      height: 32px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
      span {
        font-size: 14px;
        color: #262626;
      }
      &:hover {
        background-color: #eff0f0;
        border-radius: 6px;
      }
    }
  }
}
</style>
@/api/spaces/index

<script lang="ts" setup>
import { libraryOperationData, teamOperationData, moreOperationData, menuItemsData, spaceMenuItemsData } from '@/data/data'
import { MenuItem } from '@/type/operationPopoverType'
import { contentItemsData, moreMenuItemsData } from '@/data/data'
import { getSpacesApi, getSpacesDetailApi } from '@/api/spaces/index'
import { deleteQuickLinksApi } from '@/api/quickLinks'

interface ContentItem {
  title: string
  type: string
  icon: string
  emptyText: string
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
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const userStore = useUserStore()
const state = reactive({
  headerActive: null,
  currentGroup: null,
  currentSpace: infoStore.currentSpaceInfo.nickname || route.path.split('/')[1],
  operatData: []
})
const isShowsDeleteDialog = ref(false)
const isAdmin = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})
const typeIcon = {
  '0': '/src/assets/icons/privateIcon.svg',
  '1': '/src/assets/icons/publicIcon.svg'
}

watch(
  () => route.path,
  () => {
    infoStore.setCurrentSpaceName(route.path.split('/')[1])
    infoStore.setCurrentMenu(route.path.split('/')[2] || route.path.split('/')[1])
    infoStore.setCurrentSidebar(route.meta.asideComponent.toString())
    if (infoStore.currentSidebar === 'SpaceSidebar') {
      state.operatData = spaceMenuItemsData
      switch (infoStore.currentMenu) {
        case 'library':
          state.headerActive = 0
          break
        case 'team':
          if (route.path.split('/').length >= 4 && route.path.split('/')[2] === 'team') {
            state.headerActive = null
            state.currentGroup = route.query.gid
          } else {
            state.headerActive = 1
          }
          break
        default:
          state.headerActive = null
          break
      }
      infoStore.setCurrentSpaceInfo({
        nickname: infoStore.currentSpaceName || route.path.split('/')[1],
        name: route.query.sname.toString(),
        id: Number(route.query.sid),
        icon: ''
      })
    } else {
      state.operatData = menuItemsData
      infoStore.currentMenu === 'library' ? (state.headerActive = 0) : (state.headerActive = null)
    }
  },
  {
    immediate: true
  }
)

const toLink = (type) => {
  const query = {
    sid: route.query.sid,
    sname: route.query.sname
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
  console.log(`output->val`, val)
  if (val.target_type === 'group') {
    router.push({
      path: `/${state.currentSpace}/team/book`,
      query: {
        ...route.query,
        gname: val.title,
        gid: val.target_id
      }
    })
    state.currentGroup = val.target_id
    refreshStroe.setIsGetBookStacks(true)
  } else {
    const query = {
      lid: 64 || val.id,
      lname: val.name || val.title,
      sid: route.query.sid,
      sname: route.query.sname
    }
    switch (infoStore.currentSidebar) {
      case 'Sidebar':
        router.push({ path: '/directory/index', query })
        break
      case 'SpaceSidebar':
        router.push({
          path: `/${state.currentSpace}/directory/index`,
          query: {
            ...query
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
    path: `/${state.currentSpace}/team/book`,
    query: {
      sid: route.query.sid,
      sname: route.query.sname,
      gname: val.title,
      gid: val.target_id
    }
  })
}

const toTopic = (val) => {
  router.push({
    path: `/${state.currentSpace}/team/topic`,
    query: {
      sid: route.query.sid,
      sname: route.query.sname,
      gname: val.title,
      gid: val.target_id
    }
  })
}

const toReminderFree = (val) => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toSpaceManager = () => {
  router.push({
    path: `/${infoStore.currentSpaceName}/organize/dashboard`,
    query: {
      sid: route.query.sid,
      sname: route.query.sname
    }
  })
}

const toRemoveCommon = (val) => {
  const params = {
    user: JSON.parse(localStorage.getItem('user')).userInfo.username || '',
    space: val.space
  }
  deleteQuickLinks(val.id, params)
}

const deleteQuickLinks = async (id, params) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('移除成功')
    refreshStroe.setIsGetQuickList(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const toDeleteLibrary = (item: any) => {
  isShowsDeleteDialog.value = true
  deleteInfo.value = item
  deleteInfo.value.name = item.title
  deleteInfo.value.id = item.target_id
}

const toTeamSetting = (val) => {
  useLink(router, route, 'comTeamSet', val)
}

const toQuitTeam = (val) => {
  useLink(router, route, 'comTeamQuit', val)
}

const toMoreSetting = (val) => {
  useLink(router, route, 'comBookSet', val)
}

const getSpaces = async () => {
  const params = {
    permusername: JSON.parse(localStorage.getItem('user')).userInfo.username || ''
  }
  let res = await getSpacesApi(params)
  if (res.code === 1000) {
    if (localStorage.getItem('personalSpaceId') === null) {
      res.data.map((item) => {
        if (item.spacetype === 'personal' && item.creator === userStore.userInfo.username) {
          infoStore.setPersonalSpaceId(item.id)
        }
      })
    }
    bus.emit('TriggerSettingData', res.data)
  }
}

const getSpacesDeatil = async () => {
  let res = await getSpacesDetailApi(Number(route.query.sid))
  if (res.code === 1000) {
    // 循环res.data，找到item.permusername等于JSON.parse(localStorage.getItem('user')).userInfo.username的项，判断item.permtype是否为0，是则isAdmin为true,否则为false，找到则中止循环
    res.data.members.map((item) => {
      if (item.permusername === JSON.parse(localStorage.getItem('user')).userInfo.username) {
        if (item.permtype === '0') {
          isAdmin.value = true
        } else {
          isAdmin.value = false
        }
      }
    })
    sessionStorage.setItem('isAdmin', isAdmin.value.toString())
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getSpaces()
  if (JSON.parse(localStorage.getItem('currentSidebar')) === 'SpaceSidebar') {
    await getSpacesDeatil()
  }
})
</script>

<template>
  <div class="SiderbarComp-wrap">
    <div class="first-comp">
      <div class="top-box">
        <SidebarUserItem />
        <SidebarSearch :menuItems="state.operatData" />
        <SidebarMenuItem :menuItems="menuItems" />
      </div>
      <div class="content-box">
        <div class="library" v-for="(item, index) in props.contentItems" :key="index">
          <div :class="['header', state.headerActive === index ? 'header-active' : '']" @click="toLink(item.type)">
            <div class="header-left">
              <span class="header-icon"><i-ep-CaretRight /></span>
              <span class="header-title">{{ item.title }}</span>
            </div>
            <div class="header-right"><i-ep-ArrowRight /></div>
          </div>
          <el-tree
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
                  <img :src="item.icon" alt="" />
                  <span class="title">{{ data.name || data.groupname || data.title }}</span>
                  <span class="type-icon">
                    <img :src="typeIcon[data.public] || '/src/assets/icons/privateIcon.svg'" alt="" />
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
    <div class="divider" v-if="infoStore.currentSidebar === 'SpaceSidebar'"></div>
    <div class="last-comp">
      <div class="more-item" v-if="infoStore.currentSidebar === 'SpaceSidebar' && isAdmin" @click="toSpaceManager">
        <img src="/src/assets/icons/settingIcon.svg" alt="" />
        <span>空间管理</span>
      </div>
      <MorePopver :menuItems="moreOperationData">
        <div class="more-item">
          <img src="/src/assets/icons/moreIcon2.svg" alt="" />
          <span>更多</span>
        </div>
      </MorePopver>
    </div>
  </div>
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.SiderbarComp-wrap {
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
      padding-right: 6px;
      .library {
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
        :deep(.is-current) {
          .el-tree-node__content {
            background-color: #eff0f0 !important;
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
            max-width: calc(100% - 48px);
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
      &:hover {
        &::-webkit-scrollbar {
          display: flex;
        }
        &::-webkit-scrollbar-thumb {
          display: flex;
        }
      }
      &::-webkit-scrollbar {
        display: none;
        max-height: 60px;
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        display: none;
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

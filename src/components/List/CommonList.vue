<script lang="ts" setup>
import { commonLibraryData } from '@/data/data'
import { deleteQuickLinksApi } from '@/api/quickLinks'
import { getTeamMemberApi } from '@/api/member'

type CommonLibraryItem = {
  name?: string
  title?: string
  public: string
}

const props = defineProps({
  type: {
    type: String,
    default: 'library'
  },
  list: {
    type: Array as () => Array<CommonLibraryItem>,
    default: () => []
  }
})

const route = useRoute()
const routeInfo = { route, router }
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})
const commonTeamData = [
  { type: 'item', icon: '/src/assets/icons/commonUseIcon.svg', label: '移除常用', nick: 'removeCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/team/settingIcon.svg', label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: '/src/assets/icons/team/editIcon.svg', label: '退出团队', nick: 'toQuitTeam' }
]

// 删除知识库
const deleteLibrary = (item: any) => {
  isShowsDeleteDialog.value = true
  deleteInfo.value = item
  deleteInfo.value.name = item.title
  deleteInfo.value.id = item.target_id
  deleteInfo.value.slug = item.target_slug
}

const toTeamSetting = (item: any) => {
  useLink(routeInfo, 'comTeamSet', item)
}

const toQuitTeam = (item: any) => {
  useLink(routeInfo, 'comTeamQuit', item)
}

// 移除常用
const removeCommon = (item: any) => {
  const params = {
    space: item.space,
    user
  }
  deleteQuickLinks(item.id, params)
}

// 移除常用接口
const deleteQuickLinks = async (id, params) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    if (props.type === 'library') {
      ElMessage.success('移除成功')
      refreshStroe.setRefreshQuickBookList(true)
    } else {
      ElMessage.success('移除成功')
      refreshStroe.setRefreshQuickTeamList(true)
    }
  }
}

const toLink = (item) => {
  if (infoStore.currentSidebar === 'Sidebar') {
    router.push({
      path: `/directory/index`,
      query: {
        sid: item.space,
        sname: route.query.sname,
        lid: item.target_id,
        lname: item.title
      }
    })
  } else {
    if (item.target_type === 'group') {
      getTeamMember(item)
    } else {
      router.push({
        path: `/${infoStore.currentSpaceName}/directory/index`,
        query: {
          sid: item.space,
          sname: route.query.sname,
          lid: item.target_id,
          lname: item.title,
          gid: item.group_id,
          gname: item.group_name
        }
      })
    }
  }
}

const getTeamMember = async (val) => {
  const params = {
    group: val.target_id
  }
  let res = await getTeamMemberApi(params)
  if (res.code === 1000) {
    router.push({
      path: `/${infoStore.currentSpaceName}/team/book`,
      query: {
        sid: route.query.sid,
        sname: route.query.sname,
        gid: val.target_id,
        gname: val.title
      }
    })
  } else {
    ElMessage.error(res.msg)
  }
}

const toRename = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toMoreSetting = (val) => {
  useLink(routeInfo, 'comBookSet', val)
}

const toPermission = (val) => {
  useLink(routeInfo, 'comBookPermission', val)
}
</script>

<template>
  <div class="CommonList_wrap">
    <div class="header">常用</div>
    <div class="list">
      <div class="item_box" v-for="(item, index) in props.list" :key="index" @click="toLink(item)">
        <div class="item active">
          <div class="item-left">
            <img src="/src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
            <div class="title">
              <span>{{ item.name || item.title }}</span>
              <img v-if="item.public === '1'" src="/src/assets/icons/publicIcon.svg" alt="" class="publicIcon" />
              <img v-else src="/src/assets/icons/privateIcon.svg" alt="" class="publicIcon" />
            </div>
          </div>
          <LibraryOperationPopver
            :menuItems="type === 'library' ? commonLibraryData : commonTeamData"
            :height="40"
            @removeCommon="removeCommon(item)"
            @deleteLibrary="deleteLibrary(item)"
            @toTeamSetting="toTeamSetting(item)"
            @toQuitTeam="toQuitTeam(item)"
            @toRename="toRename(item)"
            @toPermission="toPermission(item)"
            @toMoreSetting="toMoreSetting(item)"
          >
            <div class="item-right" @click.stop>
              <img src="/src/assets/icons/moreIcon1_after.svg" alt="" class="moreIcon" />
            </div>
          </LibraryOperationPopver>
        </div>
      </div>
    </div>
  </div>
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.CommonList_wrap {
  margin-top: 20px;
  padding: 16px 16px 6px 16px;
  background-color: #fafafa;
  border-radius: 8px;
  .header {
    color: #585a5a;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item_box {
      width: 33%;
      padding: 0 4px;
      margin-bottom: 16px;
      box-sizing: border-box;
      .item {
        min-height: 64px;
        padding: 19px 28px 16px 20px;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #f4f5f5;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-left {
          display: flex;
          align-items: center;
          .bookIcon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          .title {
            display: flex;
            align-items: center;
            cursor: pointer;
            span {
              font-size: 14px;
              color: #262626;
              line-height: 24px;
            }
            .publicIcon {
              width: 14px;
              height: 14px;
              margin-left: 4px;
            }
          }
        }
        &-right {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          margin-left: 10px;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            cursor: pointer;
            background-color: #e7e9e8;
          }
        }
        &:hover {
          cursor: grab;
          border: 1px solid #d9d9d9;
          .item-right {
            opacity: 1;
            .moreIcon {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>

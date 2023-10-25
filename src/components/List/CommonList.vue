<script lang="ts" setup>
import { commonLibraryData } from '@/data/data'
import { deleteQuickLinksApi } from '@/api/quickLinks'

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

const commonTeamData = [
  { type: 'item', icon: '/src/assets/icons/commonUseIcon.svg', label: '移除常用', nick: 'removeCommon' },
  { type: 'divider' },
  { type: 'item', icon: '/src/assets/icons/team/settingIcon.svg', label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: '/src/assets/icons/team/editIcon.svg', label: '退出团队', nick: 'quitTeam' }
]
const route = useRoute()
const listStore = useListStore()
const userStore = useUserStore()
const infoStore = useInfoStore()
const dataStore = useDataStore()
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})

// 移除常用
const removeCommon = (item: any) => {
  const params = {
    user: userStore.userInfo.username,
    space: item.space
  }
  deleteQuickLinks(item.id, params)
}

// 删除知识库
const deleteLibrary = (item: any) => {
  isShowsDeleteDialog.value = true
  deleteInfo.value = item
  deleteInfo.value.name = item.title
  deleteInfo.value.id = item.target_id
}

// 移除常用接口
const deleteQuickLinks = async (id, params) => {
  let res = await deleteQuickLinksApi(id, params)
  if (res.code === 1000) {
    if (props.type === 'library') {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('移除成功')
      dataStore.setIsGetQuickList(true)
    } else {
      listStore.setRefreshQuickListStatus(true)
      ElMessage.success('移除成功')
      dataStore.setIsGetTeamQuickList(true)
    }
  }
}

const toLink = (item) => {
  console.log(`output->item.target_typ`, item)
  if (infoStore.currentSidebar === 'Sidebar') {
    router.push({
      path: `/directory/index`,
      query: {
        sid: item.space,
        sname: route.query.sname,
        lid: item.id,
        lname: item.title
      }
    })
  } else {
    if (item.target_type === 'group') {
      router.push({
        path: `/${infoStore.currentSpaceName}/team/book`,
        query: {
          sid: item.space,
          sname: route.query.sname,
          gid: item.target_id,
          gname: item.title
        }
      })
    } else {
      router.push({
        path: `/${infoStore.currentSpaceName}/directory/index`,
        query: {
          sid: item.space,
          sname: route.query.sname,
          lid: item.id,
          lname: item.title
        }
      })
    }
  }
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

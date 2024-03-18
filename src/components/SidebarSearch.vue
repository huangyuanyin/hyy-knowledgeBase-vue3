<script lang="ts" setup>
import { addArticleApi } from '@/api/article'
import { menuItemsData } from '@/data/data'
import { MenuItem } from '@/type/operationPopoverType'

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    default: () => menuItemsData
  }
})

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const isShowLinkDialog = ref(false)
const isShowSelectTemDialog = ref(false)
const isBookListDialog = ref(false)
const isSearchDialog = ref(false)
const bookListDialogTitle = ref('')
const isShowsGroupDialog = ref(false)

const { gid = '', gname = '', lid = '', lname = '' } = infoStore.currentQuery || {}

const toAddArticle = (val) => {
  if (['SpaceSidebar', 'Sidebar'].includes(route.meta.asideComponent as string)) {
    isBookListDialog.value = true
    bookListDialogTitle.value = val.label
  } else {
    const book = {
      id: lid,
      name: lname,
      group: gid,
      groupname: gname
    }
    useArticle().handleAddArticle({ book, title: val.label }, () => {})
  }
}

const toOpenTitleDialog = () => {
  isShowsGroupDialog.value = true
}

const toAddTitle = async (val) => {
  const params = {
    title: val[0],
    type: 'title',
    description: val[1],
    parent: null,
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
      sid: infoStore.currentQuery.sid,
      sname: infoStore.currentQuery.sname,
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

const toDo = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('暂未开放，敬请期待！')
}
</script>

<template>
  <div class="SidebarSearch-wrap">
    <div class="search-input">
      <span @click="isSearchDialog = true"><i-ep-Search />搜索</span>
    </div>
    <AddOperationPopver
      :menu-items="props.menuItems"
      @toAddDoc="toAddArticle"
      @toAddSheet="toAddArticle"
      @toAddPPT="toAddArticle"
      @toAddMindmap="toAddArticle"
      @toImportTem="isShowSelectTemDialog = true"
      @toAddGroup="toOpenTitleDialog"
      @toAddLink="isShowLinkDialog = true"
      @toDo="toDo"
    />
  </div>
  <SelectTemDialog :isShow="isShowSelectTemDialog" @closeDialog="isShowSelectTemDialog = false" />
  <LinkDialog :isShow="isShowLinkDialog" :parent="null" @closeDialog="isShowLinkDialog = false" />
  <BookListDialog :show="isBookListDialog" @closeDialog="isBookListDialog = false" :title="bookListDialogTitle" />
  <SearchDialog :show="isSearchDialog" @closeDialog="isSearchDialog = false" />
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTitle="toAddTitle" title="新建分组" type="title" />
</template>

<style lang="scss" scoped>
.SidebarSearch-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  .search-input {
    margin-right: 12px;
    flex: 1;
    span {
      width: 100%;
      background: #eff0f0;
      height: 32px;
      cursor: pointer;
      border: 0;
      opacity: 1;
      border-radius: 8px;
      color: #bec0bf;
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 4px 11px;
      box-sizing: border-box;
      svg {
        height: 18px;
        width: 18px;
        margin-right: 4px;
      }
    }
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      margin-right: 12px;
      box-shadow: none;
      background-color: #eff0f0;
    }
    :deep(.el-input__inner) {
      cursor: pointer !important;
    }
    :deep(.el-input__prefix-inner) {
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>

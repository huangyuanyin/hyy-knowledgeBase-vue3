<script lang="ts" setup>
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
const spaceId = ref('') // 当前空间id
const bookId = ref('') // 当前知识库id
const isShowLinkDialog = ref(false)
const isShowSelectTemDialog = ref(false)
const isBookListDialog = ref(false)
const isSearchDialog = ref(false)
const bookListDialogTitle = ref('')

watchEffect(() => {
  spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
  bookId.value = route.query.lid as string
})

const toAddArticle = (val) => {
  if (['SpaceSidebar', 'Sidebar'].includes(route.meta.asideComponent as string)) {
    isBookListDialog.value = true
    bookListDialogTitle.value = val.label
  } else {
    const book = {
      id: bookId.value,
      name: route.query.lname as string,
      group: route.query.gid as string,
      groupname: route.query.gname as string
    }
    useArticle().handleAddArticle({ book, title: val.label }, () => {})
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
      @toAddGroup="toAddArticle"
      @toAddLink="isShowLinkDialog = true"
      @toDo="toDo"
    />
  </div>
  <SelectTemDialog :isShow="isShowSelectTemDialog" @closeDialog="isShowSelectTemDialog = false" />
  <LinkDialog :isShow="isShowLinkDialog" :parent="null" @closeDialog="isShowLinkDialog = false" />
  <BookListDialog :show="isBookListDialog" @closeDialog="isBookListDialog = false" :title="bookListDialogTitle" />
  <SearchDialog :show="isSearchDialog" @closeDialog="isSearchDialog = false" />
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

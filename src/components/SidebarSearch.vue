<script lang="ts" setup>
import { menuItemsData } from '@/data/data'
import { MenuItem } from '@/type/operationPopoverType'
import { useArticle } from '@/hooks/useArticle'

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    default: () => menuItemsData
  }
})

const route = useRoute()
const spaceType = ref('') // 当前空间类型
const spaceId = ref('') // 当前空间id
const bookId = ref('') // 当前知识库id
const isShowLinkDialog = ref(false)
const isShowSelectTemDialog = ref(false)
const isBookListDialog = ref(false)
const bookListDialogTitle = ref('')

watchEffect(() => {
  spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
  spaceId.value = spaceType.value === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
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
    <el-input class="search-input" placeholder="搜索" disabled :autofocus="false">
      <template #prefix>
        <i-ep-Search />
      </template>
    </el-input>
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
</template>

<style lang="scss" scoped>
.SidebarSearch-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      margin-right: 12px;
      box-shadow: none;
      background-color: #eff0f0;
    }
    :deep(.el-input__prefix-inner) {
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>

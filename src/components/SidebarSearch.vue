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
const router = useRouter()
const refreshStroe = useRefreshStore()
const spaceType = ref('') // 当前空间类型
const spaceId = ref('') // 当前空间id
const bookId = ref('') // 当前知识库id
const isShowLinkDialog = ref(false)
const articleType = {
  文档: { type: 'doc', title: '无标题文档' },
  表格: { type: 'sheet', title: '无标题表格' },
  幻灯片: { type: 'ppt', title: '无标题幻灯片' },
  新建分组: { type: 'title', title: '新建分组' }
}

watchEffect(() => {
  spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
  spaceId.value = spaceType.value === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
  bookId.value = route.query.lid as string
})

const toAddArticle = (val) => {
  addArticle(articleType[val.label], null)
}

// 处理新建不同文章逻辑
const addArticle = async (article, parent) => {
  const params = {
    title: article.title,
    type: article.type,
    body: '',
    parent,
    book: bookId.value,
    space: spaceId.value
  }
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    if (res.data.type === 'title') {
      ElMessage.success('分组新建成功')
      refreshStroe.setRefreshBookList(true)
    } else {
      useAddArticleAfterToLink(route, router, spaceType.value, res.data, true)
    }
  } else {
    ElMessage.error(res.msg)
  }
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
      @toAddGroup="toAddArticle"
      @toAddLink="isShowLinkDialog = true"
    />
  </div>
  <LinkDialog :isShow="isShowLinkDialog" :parent="null" @closeDialog="isShowLinkDialog = false" />
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

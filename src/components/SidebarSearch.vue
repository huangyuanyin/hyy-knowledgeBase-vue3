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

const toAddArticle = (val) => {
  addArticle('doc', null)
}

const addArticle = async (type, parent) => {
  const spaceType = route.path.split('/').length === 3 ? '个人' : '公共'
  const params = {
    title: '新建文档',
    book: route.query.lid as string,
    space: spaceType === '个人' ? localStorage.getItem('personalSpaceId') : (route.query.sid as string),
    type,
    body: '',
    parent
  }
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    if (spaceType === '个人') {
      router.push({
        path: `/directory/article`,
        query: {
          ...route.query,
          aid: res.data.id,
          aname: res.data.title
        }
      })
    } else {
      router.push({
        path: `/${route.path.split('/')[1]}/directory/article`,
        query: {
          ...route.query,
          aid: res.data.id,
          aname: res.data.title
        }
      })
    }
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <div class="sidebar-search">
    <el-input class="search-input" placeholder="搜索" disabled :autofocus="false">
      <template #prefix>
        <i-ep-Search />
      </template>
    </el-input>
    <AddOperationPopver :menu-items="props.menuItems" @toAddArticle="toAddArticle" />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-search {
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

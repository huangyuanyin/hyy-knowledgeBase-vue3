<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const dataStore = useDataStore()
const menuItems = [
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'notes', icon: 'noteIcon', label: '小记' },
  { index: 'collections', icon: 'startIcon', label: '收藏' }
]
const contentItems = ref([
  {
    id: null,
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: [] // 常用知识库列表
  }
])

watch(
  () => dataStore.isGetQuickList,
  (newVal) => {
    if (newVal) {
      getCommonLibrary()
      dataStore.setIsGetQuickList(false)
    }
  }
)

// 获取个人空间下的团队列表
const getGroups = async () => {
  console.log(`output->23232`, 23232)
  const params = {
    space: localStorage.getItem('personalSpaceId')
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    contentItems.value[0].id = res.data[0].id
    console.log(`output->hhhh`, params.space, res.data[0].id)
    localStorage.setItem('personalGroupId', res.data[0].id)
  }
}

// 获取常用知识库列表
const getCommonLibrary = async () => {
  const params = {
    space: localStorage.getItem('personalSpaceId'),
    target_type: 'book'
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    contentItems.value[0].libraryList = res.data || ([] as any)
  }
}

onMounted(async () => {
  await getGroups()
  await getGroups()
  await getCommonLibrary()
})
</script>

<style lang="scss" scoped></style>

<template>
  <SiderbarComp :menuItems="menuItems" :contentItems="contentItems" />
</template>

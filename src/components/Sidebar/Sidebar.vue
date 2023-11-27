<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const refreshStroe = useRefreshStore()
const dataStore = useDataStore()
const personalSpaceId = JSON.parse(localStorage.getItem('personalSpaceInfo')).id.toString() || '' // 个人空间id
const user = JSON.parse(localStorage.getItem('userInfo')).username || '' // 当前登录用户
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
    icon: '',
    emptyText: '暂无常用知识库',
    isExpand: localStorage.getItem('bookIsExpand') === 'false' ? false : true,
    libraryList: [] // 常用知识库列表
  }
])

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getCommonLibrary()
      setTimeout(() => {
        refreshStroe.setRefreshQuickBookList(false)
      }, 0)
    }
  }
)

// 获取个人空间下的团队列表
const getGroups = async () => {
  const params = {
    space: personalSpaceId
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    contentItems.value[0].id = res.data[0].id
    dataStore.setTeamList(res.data)
    localStorage.setItem('personalGroupId', res.data[0].id)
  }
}

// 获取常用知识库列表
const getCommonLibrary = async () => {
  const params = {
    space: personalSpaceId,
    target_type: 'book',
    user
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    contentItems.value[0].libraryList = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  nextTick(async () => {
    await getGroups()
    await getCommonLibrary()
  })
})
</script>

<template>
  <SiderbarComp :menuItems="menuItems" :contentItems="contentItems" />
</template>

<style lang="scss" scoped></style>

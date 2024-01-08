<script lang="ts" setup>
const refreshStroe = useRefreshStore()
const dataStore = useDataStore()
const personalSpaceId = ref('') // 个人空间id
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

const { teamList: list, getTeamList } = useTeam()
const { commonBookList, getCommonList } = useCommon()

watchEffect(() => {
  nextTick(() => {
    if (JSON.parse(localStorage.getItem('personalSpaceInfo'))) {
      personalSpaceId.value = JSON.parse(localStorage.getItem('personalSpaceInfo')).id.toString() || ''
    }
  })
})

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getCommonBookList()
      setTimeout(() => {
        refreshStroe.setRefreshQuickBookList(false)
      }, 0)
    }
  }
)

// 获取个人空间下的团队列表
const getGroups = async () => {
  await getTeamList()
  contentItems.value[0].id = list.value[0].id
  dataStore.setTeamList(list.value)
  localStorage.setItem('personalGroupId', list.value[0].id)
}

// 获取常用知识库列表
const getCommonBookList = async () => {
  await getCommonList('book')
  contentItems.value[0].libraryList = commonBookList.value
}

onMounted(() => {
  nextTick(async () => {
    await getGroups()
    await getCommonBookList()
  })
})
</script>

<template>
  <SiderbarComp :menuItems="menuItems" :contentItems="contentItems" />
</template>

<style lang="scss" scoped></style>

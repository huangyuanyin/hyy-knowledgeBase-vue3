<template>
  <Suspense>
    <SiderbarComp :sectionType="'space'" :menuItems="menuItems" :contentItems="contentItems" :moreMenuItems="moreMenuItems" />
  </Suspense>
</template>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'
import { getGroupsApi } from '@/api/groups'

const libraryList = ref([])
const groupsList = ref([])

const menuItems = [
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'collections', icon: 'startIcon', label: '收藏' },
  { index: 'public', icon: 'publicAreaIcon', label: '公共区' }
]

const contentItems = ref([
  {
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    typeIcon: '/src/assets/icons/publicIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: libraryList
  },
  {
    title: '团队',
    type: 'team',
    icon: '/src/assets/icons/teamIcon.svg',
    typeIcon: '/src/assets/icons/privateIcon.svg',
    emptyText: '暂无常用团队',
    libraryList: groupsList.value
  }
])

const moreMenuItems = [
  { icon: '/src/assets/icons/settingIcon.svg', label: '空间管理' },
  { icon: '/src/assets/icons/moreIcon2.svg', label: '更多' }
]

onMounted(async () => {
  const { groupsList, getGroups } = await useGroupsApi(getGroupsApi, { space: 1 })
  getGroups()
  groupsList.value = groupsList.value
  console.log(`output->useGroupsApi(getGroupsApi, { Space: 1 })`, groupsList.value)
  contentItems.value[1].libraryList = groupsList.value
  const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
  fetchLibrary()
  libraryList.value = libraryList
})
</script>

<style lang="scss" scoped></style>

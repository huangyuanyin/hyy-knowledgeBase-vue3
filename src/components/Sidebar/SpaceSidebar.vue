<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const route = useRoute()
const userStore = useUserStore()
const spaceId = ref(route.query.id) // 当前空间id

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
    libraryList: []
  },
  {
    title: '团队',
    type: 'team',
    icon: '/src/assets/icons/teamIcon.svg',
    typeIcon: '/src/assets/icons/privateIcon.svg',
    emptyText: '暂无常用团队',
    libraryList: []
  }
])

const moreMenuItems = [
  { icon: '/src/assets/icons/settingIcon.svg', label: '空间管理' },
  { icon: '/src/assets/icons/moreIcon2.svg', label: '更多' }
]

onMounted(async () => {
  const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { space: spaceId.value })
  await fetchLibrary()
  contentItems.value[0].libraryList = libraryList.value
  const { groupsList, getGroups } = await useGroupsApi(getGroupsApi, { space: spaceId.value })
  getGroups()
  contentItems.value[1].libraryList = groupsList.value.filter((item) => item.is_default !== '1')
})
</script>

<template>
  <Suspense>
    <SiderbarComp :sectionType="'space'" :menuItems="menuItems" :contentItems="contentItems" :moreMenuItems="moreMenuItems" />
  </Suspense>
</template>

<style lang="scss" scoped></style>

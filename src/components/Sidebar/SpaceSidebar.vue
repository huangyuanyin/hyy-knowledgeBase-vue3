<template>
  <SiderbarComp :sectionType="'space'" :menuItems="menuItems" :contentItems="contentItems" :moreMenuItems="moreMenuItems" />
</template>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'
const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()

const menuItems = [
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'collections', icon: 'startIcon', label: '收藏' },
  { index: 'public', icon: 'publicAreaIcon', label: '公共区' }
]

const contentItems = [
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
    libraryList: libraryList
  }
]

const moreMenuItems = [
  { icon: '/src/assets/icons/settingIcon.svg', label: '空间管理' },
  { icon: '/src/assets/icons/moreIcon2.svg', label: '更多' }
]
</script>

<style lang="scss" scoped></style>

<template>
  <SiderbarComp :menuItems="menuItems" :contentItems="contentItems" />
</template>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'
const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()

const menuItems = [
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'notes', icon: 'noteIcon', label: '小记' },
  { index: 'collections', icon: 'startIcon', label: '收藏' }
]

const contentItems = [
  {
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    typeIcon: '/src/assets/icons/publicIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: libraryList
  }
]
</script>

<style lang="scss" scoped></style>

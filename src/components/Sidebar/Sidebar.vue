<template>
  <SiderbarComp :menuItems="menuItems" :contentItems="contentItems" />
</template>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'

const infoStore = useInfoStore()
const publicId = ref('0') // 个人知识库还是公共知识库 0: 个人 1: 公共
const username = ref(JSON.parse(localStorage.getItem('user')).userInfo.username || '') // 用户名
const contentItems = ref([
  {
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: [] // 知识库列表
  }
])
const menuItems = [
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'notes', icon: 'noteIcon', label: '小记' },
  { index: 'collections', icon: 'startIcon', label: '收藏' }
]

// 获取知识库列表
const getLibrary = async () => {
  const params = {
    public: publicId.value
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    contentItems.value[0].libraryList = res.data || ([] as any)
  }
}

onMounted(async () => {
  console.log(`当前侧边栏类型：`, infoStore.currentSidebar)
  publicId.value = infoStore.currentSidebar === 'Sidebar' ? '0' : '1'
  await getLibrary()
})
</script>

<style lang="scss" scoped></style>

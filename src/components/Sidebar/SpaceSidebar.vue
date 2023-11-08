<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const route = useRoute()
const listStore = useListStore()
const refreshStroe = useRefreshStore()
const dataStore = useDataStore()
const spaceId = ref(route.query.sid) // 当前空间id
const menuItems = ref([
  { index: 'dashboard', icon: 'actionIcon', label: '开始' },
  { index: 'collections', icon: 'startIcon', label: '收藏' },
  { id: null, index: 'public', icon: 'publicAreaIcon', label: '公共区' }
])

const contentItems = ref([
  {
    id: null,
    title: '知识库',
    type: 'library',
    icon: '/src/assets/icons/bookIcon.svg',
    typeIcon: '/src/assets/icons/publicIcon.svg',
    emptyText: '暂无常用知识库',
    libraryList: []
  },
  {
    id: null,
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

watch(
  () => refreshStroe.isGetTeamQuickList,
  (newVal) => {
    if (newVal) {
      getCommonTeam()
      refreshStroe.setIsGetTeamQuickList(false)
    }
  }
)

watch(
  () => refreshStroe.isGetQuickList,
  (newVal) => {
    if (newVal) {
      getCommonLibrary()
      refreshStroe.setIsGetQuickList(false)
    }
  }
)

watch(
  () => listStore.refreshQuickListStatus,
  (newVal) => {
    if (newVal) {
      console.log(`output->12121`, 12121)
      getCommonTeam()
      getCommonLibrary()
      listStore.setRefreshQuickListStatus(false)
    }
  }
)

// 获取常用知识库列表
const getCommonLibrary = async () => {
  const params = {
    space: route.query.sid,
    user: JSON.parse(localStorage.getItem('user')).userInfo.username,
    target_type: 'book'
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    contentItems.value[0].libraryList = res.data || ([] as any)
  }
}

// 获取常用团队列表
const getCommonTeam = async () => {
  const params = {
    space: route.query.sid,
    user: JSON.parse(localStorage.getItem('user')).userInfo.username,
    target_type: 'group'
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    contentItems.value[1].libraryList = res.data || ([] as any)
  }
}

// 获取当前空间下的全部团队
const getGroups = async () => {
  const params = {
    space: String(spaceId.value)
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    menuItems.value[2].id = res.data.filter((item) => item.is_default === '1')[0].id
    dataStore.setTeamList(res.data)
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getCommonLibrary()
  await getCommonTeam()
  await getGroups()
})
</script>

<template>
  <Suspense>
    <SiderbarComp :sectionType="'space'" :menuItems="menuItems" :contentItems="contentItems" :moreMenuItems="moreMenuItems" />
  </Suspense>
</template>

<style lang="scss" scoped></style>

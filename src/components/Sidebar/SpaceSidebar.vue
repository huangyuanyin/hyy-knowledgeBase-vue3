<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'

const route = useRoute()
const refreshStroe = useRefreshStore()
const dataStore = useDataStore()
const spaceId = ref('') // 当前公共空间id
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
    icon: '',
    typeIcon: '/src/assets/icons/publicIcon.svg',
    emptyText: '暂无常用知识库',
    isExpand: localStorage.getItem('bookIsExpand') === 'false' ? false : true,
    libraryList: []
  },
  {
    id: null,
    title: '团队',
    type: 'team',
    icon: '',
    typeIcon: '/src/assets/icons/privateIcon.svg',
    emptyText: '暂无常用团队',
    isExpand: localStorage.getItem('teamIsExpand') === 'false' ? false : true,
    libraryList: []
  }
])
const moreMenuItems = [
  { icon: '/src/assets/icons/settingIcon.svg', label: '空间管理' },
  { icon: '/src/assets/icons/moreIcon2.svg', label: '更多' }
]

const { commonBookList, commonTeamList, getCommonList } = useCommon()

watchEffect(() => {
  spaceId.value = route.query.sid as string
})

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getCommonBookList()
      // fix 知识库/团队第一次切换后添加移除常用时，常用列表不刷新。
      setTimeout(() => {
        refreshStroe.setRefreshQuickBookList(false)
      }, 0)
    }
  }
)

watch(
  () => refreshStroe.isRefreshQuickTeamList,
  (newVal) => {
    if (newVal) {
      getCommonTeamList()
      setTimeout(() => {
        refreshStroe.setRefreshQuickTeamList(false)
      }, 0)
    }
  }
)

// 获取常用知识库列表
const getCommonBookList = async () => {
  await getCommonList('book')
  contentItems.value[0].libraryList = commonBookList.value
}

// 获取常用团队列表
const getCommonTeamList = async () => {
  await getCommonList('group')
  contentItems.value[1].libraryList = commonTeamList.value
}

// 获取当前空间下的全部团队
const getGroups = async () => {
  const params = {
    space: spaceId.value
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    menuItems.value[2].id = res.data.filter((item) => item.is_default === '1')[0].id
    dataStore.setTeamList(res.data) // 存储当前空间下的全部团队
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getCommonBookList()
  await getCommonTeamList()
  await getGroups()
})
</script>

<template>
  <Suspense>
    <SiderbarComp :sectionType="'space'" :menuItems="menuItems" :contentItems="contentItems" :moreMenuItems="moreMenuItems" />
  </Suspense>
</template>

<style lang="scss" scoped></style>

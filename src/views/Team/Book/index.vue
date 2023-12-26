<script lang="ts" setup>
import { getBookStacksApi } from '@/api/bookstacks'
import { getGroupsDetailApi } from '@/api/groups'
import { getLibraryApi } from '@/api/library'
import { getQuickLinksApi } from '@/api/quickLinks'

interface BookGroup {
  id: number
  name: string
  is_default: string
}

const route = useRoute()
const refreshStroe = useRefreshStore()
const spaceId = ref('') // 当前组织空间id
const groupId = ref('') // 当前团队id
const teamInfo = ref({})
const bookGroup = ref<BookGroup[]>([])
const libarayList = ref([])
const commonList = ref([])
const isHasPermissionCode = ref(null)
const teamIcon = ref('')

watchEffect(() => {
  spaceId.value = route.query.sid as string
  groupId.value = route.query.gid as string
})

watch(
  () => groupId.value,
  async (newVal) => {
    if (newVal) {
      groupId.value = newVal
      await getBookStacks()
      await getLibrary()
      await getQuickLinks()
      await getGroupsDetail()
    }
  }
)

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getBookStacks()
      getQuickLinks()
    }
  }
)

watchEffect(() => {
  if (isHasPermissionCode.value === 1003) {
    isHasPermissionCode.value = null
    router.replace('/no-permission')
  }
})

// 获取当前组织空间下当前团队的知识库分组列表
const getBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data as unknown as BookGroup[]
  } else {
    ElMessage.error(res.msg)
  }
}

// 获取当前团队下的知识库列表
const getLibrary = async () => {
  const params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getLibraryApi(params)
  isHasPermissionCode.value = res.code
  if (res.code === 1000) {
    libarayList.value = res.data || ([] as any)
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
      grouping: true
    })
  }
}

// 获取该空间下常用知识库列表
const getQuickLinks = async () => {
  const params = {
    target_type: 'book',
    space: spaceId.value
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonList.value = res.data || ([] as any)
    libarayList.value.forEach((item) => {
      item.is_common_id = null
      commonList.value.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
  }
}

// 获取团队详情
const getGroupsDetail = async () => {
  let res = await getGroupsDetailApi(Number(groupId.value))
  if (res.code === 1000) {
    sessionStorage.setItem('currentTeamInfo', JSON.stringify(res.data))
    teamIcon.value = res.data.icon
    teamInfo.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const updateBulletin = () => {
  getGroupsDetail()
}

onMounted(async () => {
  await getBookStacks()
  await getLibrary()
  await getQuickLinks()
  await getGroupsDetail()
})
</script>

<template>
  <div class="Book_wrap">
    <TeamHeader :icon="teamIcon" />
    <Announcement :info="teamInfo" @update="updateBulletin" type="team" />
    <SwitchModuleItem moduleType="operation" @getBookStacks="getBookStacks">
      <template v-slot:left><span class="title">知识库</span></template>
    </SwitchModuleItem>
    <div class="book_header" v-if="bookGroup.length > 1">
      <div class="item" v-for="(item, index) in bookGroup" :key="'bookGroup' + index">
        <div class="name">{{ item.name }}</div>
        <div class="dot" v-if="index !== bookGroup.length - 1"></div>
      </div>
    </div>
    <LibraryTable title="知识库" :commonList="commonList" :group="bookGroup" @getBookStacks="getBookStacks" />
  </div>
</template>

<style lang="scss" scoped>
.Book_wrap {
  // margin: -26px -36px !important;
  // padding: 0 36px;
  width: 100%;
  .Announcement_wrap {
    margin-top: 20px;
    margin-bottom: 32px;
  }
  .book_header {
    display: flex;
    border: 1px solid #e7e9e8;
    border-radius: 6px;
    padding: 8px 16px;
    background-color: #fff;
    margin-top: 8px;
    box-sizing: border-box;
    .item {
      display: flex;
      align-items: center;
      font-size: 12px;
      .name {
        font-size: 12px;
        cursor: pointer;
        margin-right: 16px;
        max-width: 154px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dot {
        display: block;
        background-color: #e7e9e8;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        margin-right: 16px;
      }
    }
  }
}
</style>

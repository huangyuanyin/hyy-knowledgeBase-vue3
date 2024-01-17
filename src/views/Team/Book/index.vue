<script lang="ts" setup>
import { getBookStacksApi } from '@/api/bookstacks'

interface BookGroup {
  id: number
  name: string
  is_default: string
}

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const teamInfo = ref({})
const bookGroup = ref<BookGroup[]>([])
const libarayList = ref([])
const cBookList = ref([])
const isHasPermission = ref(true)
const teamIcon = ref('')

const { isHasPermission: permission, bookList: list, getBookList } = useBook()
const { commonBookList, getCommonList, findCommonItem } = useCommon()

watch(
  () => infoStore.currentQuery?.gid,
  async (newVal) => {
    if (newVal) {
      await getBookStacks()
      await getLibrary()
      await getCommonBookList()
      await getGroupsDetail()
    }
  }
)

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getBookStacks()
      getCommonBookList()
    }
  }
)

watchEffect(() => {
  !isHasPermission.value && router.replace('/no-permission')
})

// 获取当前组织空间下当前团队的知识库分组列表
const getBookStacks = async () => {
  const params = {
    space: infoStore.currentQuery?.sid,
    group: infoStore.currentQuery?.gid
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
  await getBookList({
    space: infoStore.currentQuery?.sid,
    group: infoStore.currentQuery?.gid
  })
  isHasPermission.value = permission.value
  libarayList.value = list.value
}

// 获取该空间下常用知识库列表
const getCommonBookList = async () => {
  await getCommonList('book')
  cBookList.value = commonBookList.value
  findCommonItem('group', libarayList.value)
}

// 获取团队详情
const getGroupsDetail = async () => {
  useTeam().getTeamInfo(Number(infoStore.currentQuery?.gid), (res: any) => {
    if (Reflect.ownKeys(res).length) {
      teamIcon.value = res.icon
      teamInfo.value = res
    }
  })
}

const updateBulletin = () => {
  getGroupsDetail()
}

onMounted(async () => {
  await getBookStacks()
  await getLibrary()
  await getCommonBookList()
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
    <LibraryTable title="知识库" :commonList="cBookList" :group="bookGroup" @getBookStacks="getBookStacks" />
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

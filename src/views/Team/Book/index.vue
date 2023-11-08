<script lang="ts" setup>
import { getBookStacksApi } from '@/api/bookstacks'
import { getLibraryApi } from '@/api/library'
import { getQuickLinksApi } from '@/api/quickLinks'

interface BookGroup {
  id: number
  name: string
  is_default: string
}

const route = useRoute()
const refreshStroe = useRefreshStore()
const bookGroup = ref<BookGroup[]>([])
const libarayList = ref([])
const commonList = ref([])
const spaceId = ref(route.query.sid)
const groupId = ref(route.query.gid)

watch(
  () => route.query.gid,
  (newVal) => {
    groupId.value = newVal
    getBookStacks()
  }
)

watch(
  () => refreshStroe.isGetQuickList,
  (newVal) => {
    if (newVal) {
      getQuickLinks()
    }
  }
)

const getBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: route.query.gid
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data as unknown as BookGroup[]
  }
}

// 获取当前团队下的知识库列表
const getLibrary = async () => {
  let params = {}
  params = {
    space: route.query.sid,
    group: route.query.gid
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    libarayList.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

// 获取该空间下常用知识库列表
const getQuickLinks = async () => {
  const params = {
    target_type: 'book',
    space: route.query.sid
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

onMounted(async () => {
  await getBookStacks()
  await getLibrary()
  await getQuickLinks()
})
</script>

<template>
  <div class="Book_wrap">
    <TeamHeader />
    <div class="announcement">
      <div>管理员可以添加自定义内容，向 全体团队成员展示</div>
      <img src="/src/assets/icons/rightArrowIcon.svg" alt="" />
    </div>
    <SwitchModuleItem moduleType="operation">
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
  margin: -26px -36px !important;
  padding: 0 36px;
  width: 100%;
  .announcement {
    margin-top: 20px;
    margin-bottom: 32px;
    height: 57px;
    border-radius: 8px;
    color: #bec0bf;
    border: 1px dashed #d8dad9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      color: #bec0bf;
      cursor: pointer;
      font-size: 14px;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    img {
      transform: rotate(180deg);
    }
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

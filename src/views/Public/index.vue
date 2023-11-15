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
const spaceId = ref('') // 当前空间id
const groupId = ref('') // 当前公共区id
const bookGroup = ref([])
const commonList = ref([])
const libarayList = ref([])

watchEffect(() => {
  spaceId.value = route.query.sid as string
  groupId.value = route.query.gid as string
})

watch(
  () => refreshStroe.isRefreshQuickBookList,
  async (newVal) => {
    if (newVal) {
      await getBookStacks()
      await getLibrary()
      await getQuickLinks()
    }
  }
)

// 获取当前空间下公共区的知识库分组列表
const getBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data as unknown as BookGroup[]
  }
}

// 获取当前空间下的常用知识库列表
const getQuickLinks = async () => {
  const params = {
    target_type: 'book',
    space: spaceId.value
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonList.value = res.data || ([] as any)
    // 遍历知识库列表和常用知识库列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
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

// 获取当前空间下公共区的知识库列表
const getLibrary = async () => {
  let params = {}
  params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getLibraryApi(params)
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

onMounted(async () => {
  await getBookStacks()
  await getLibrary()
  await getQuickLinks()
})
</script>

<template>
  <div class="Public_wrap">
    <div class="header">
      <span>公共区</span>
      <div class="tag">
        <img src="/src/assets/icons/publicTagIcon.svg" alt="" />
        <el-tooltip class="box-item" effect="dark" content="公共区内容面向空间所有成员开放" placement="bottom">
          <span>全员可见</span>
        </el-tooltip>
      </div>
    </div>
    <div class="announcement">
      <div>管理员可以添加面向全体成员的公告信息</div>
      <img src="/src/assets/icons/rightArrowIcon.svg" alt="" />
    </div>
    <div class="content">
      <SwitchModuleItem moduleType="operation">
        <template v-slot:left> <span class="title">知识库</span> </template>
      </SwitchModuleItem>
      <LibraryTable title="知识库" :commonList="commonList" :group="bookGroup" @getBookStacks="getBookStacks" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Public_wrap {
  max-width: 1585px;
  .header {
    display: flex;
    align-items: center;
    span {
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      font-weight: 700;
      color: #262626;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    .tag {
      display: flex;
      align-items: center;
      margin-left: 16px;
      border-radius: 6px;
      background-color: #f4f5f5;
      font-size: 12px;
      padding: 5px;
      display: inline-flex;
      height: 22px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        width: 12px;
        height: 12px;
      }
      span {
        line-height: 30px;
        margin-left: 4px;
        font-size: 12px;
        font-weight: 400;
        height: 30px;
      }
    }
  }
  .announcement {
    margin-top: 20px;
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
  .content {
    margin-top: 48px;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #000;
    }
  }
}
</style>

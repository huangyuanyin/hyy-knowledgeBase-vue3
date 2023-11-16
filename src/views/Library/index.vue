<script lang="ts" setup>
import { getBookStacksApi } from '@/api/bookstacks'
import { getLibraryApi } from '@/api/library'
import { getQuickLinksApi } from '@/api/quickLinks'

const route = useRoute()
const refreshStroe = useRefreshStore()
const dataStore = useDataStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const currentSidebar = ref(sessionStorage.getItem('currentSidebar')) // 当前类型：个人、公共
const spaceId = ref('') // 当前空间id
const personalGroupId = ref('') // 个人空间下的团队id
const bookList = ref([]) // 当前空间下的知识库列表
const commonList = ref([]) // 当前空间下的常用列表
const bookGroup = ref([]) // 当前空间&&当前团队下的知识库分组
const libraryInput = ref('')
const isShowsLibraryDialog = ref(false)

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getQuickLinks()
      setTimeout(() => {
        refreshStroe.setRefreshQuickBookList(false)
      }, 0)
    }
  }
)

watch(
  () => refreshStroe.isRefreshBookList,
  (newVal) => {
    if (newVal) {
      getBook()
      if (currentSidebar.value === 'Sidebar') {
        getBookStacks()
      }
      setTimeout(() => {
        refreshStroe.setRefreshBookList(false)
      }, 0)
    }
  }
)

watchEffect(() => {
  currentSidebar.value = sessionStorage.getItem('currentSidebar')
  if (currentSidebar.value === 'Sidebar') {
    spaceId.value = JSON.parse(localStorage.getItem('personalSpaceInfo')).id
  } else {
    spaceId.value = route.query.sid as string
  }
  personalGroupId.value = localStorage.getItem('personalGroupId')
})

// 获取当前空间下的常用列表
const getQuickLinks = async () => {
  const params = {
    target_type: 'book',
    space: spaceId.value,
    user
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonList.value = res.data || ([] as any)
    // 遍历知识库列表和常用知识库列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
    bookList.value.forEach((item) => {
      item.is_common_id = null
      commonList.value.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
    refreshStroe.setRefreshQuickBookList(false)
    dataStore.setCommonLibraryList(commonList.value)
  } else {
    ElMessage.error(res.msg)
  }
}

// 获取当前空间下的知识库列表
const getBook = async () => {
  let params = {
    space: spaceId.value
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    bookList.value = res.data || ([] as any)
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
      grouping: true
    })
  }
}

// 获取个人空间知识库团队下的知识库分组
const getBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: personalGroupId.value
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data || ([] as any)
  }
}

const filterGroupFromPublic = (list) => {
  return list.filter((item) => item.group_name !== '公共区')
}

onMounted(async () => {
  await getBook()
  await getQuickLinks()
  if (currentSidebar.value === 'Sidebar') {
    await getBookStacks()
  }
})
</script>

<template>
  <div class="Library_wrap">
    <div class="header">知识库</div>
    <!-- <div style="display: flex; justify-content: flex-end">
      <CooperatePopver :menuItems="commonLibraryData" />
    </div> -->
    <CommonList :list="commonList" />
    <div class="library_box">
      <div class="libraryList">
        <SwitchModuleItem
          v-if="currentSidebar === 'Sidebar'"
          :moduleType="'operation'"
          :moduleGenre="'my'"
          :moduleGenreData="[
            {
              type: 'my',
              name: '我个人的'
            },
            {
              type: 'public',
              name: '邀请协作的'
            }
          ]"
        />
        <SwitchModuleItem
          v-else
          :moduleGenre="'my'"
          :moduleGenreData="[
            {
              type: 'my',
              name: '来自团队的'
            },
            {
              type: 'public',
              name: '邀请协作的'
            }
          ]"
        >
          <template #right>
            <div class="button">
              <el-input v-model="libraryInput" placeholder="搜索知识库" clearable>
                <template #prefix>
                  <i-ep-Search />
                </template>
              </el-input>
              <el-button @click="isShowsLibraryDialog = true">
                <template #icon>
                  <img class="addIcon" src="/src/assets/icons/addIcon.svg" alt="" />
                  <img class="addIcon_hover" src="/src/assets/icons/addIcon_hover.svg" alt="" />
                </template>
                新建知识库
              </el-button>
            </div>
          </template>
        </SwitchModuleItem>
        <LibraryTable v-if="currentSidebar === 'Sidebar'" title="知识库" :commonList="commonList" :group="bookGroup" @getBookStacks="getBookStacks" />
        <TableComp v-else :header="['名称', '归属', '创建人', '更新时间', '']" type="library" :data="filterGroupFromPublic(bookList)" />
        <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Library_wrap {
  max-width: 1585px;
  .header {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
  .library_box {
    margin-top: 28px;
    .libraryList {
      margin-bottom: 4px;
      .button {
        display: flex;
        align-items: center;
        color: #262626;
        .el-input {
          margin-right: 12px;
          max-width: 164px;
        }
        :deep(.el-input__wrapper) {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          box-shadow: none;
          &:hover {
            border-color: #0bd07d;
          }
        }

        .el-button {
          border-radius: 6px;
          .addIcon {
            display: flex;
          }
          .addIcon_hover {
            display: none;
          }
          &:hover {
            color: #009456;
            border-color: #009456;
            background-color: #fff;
            .addIcon {
              display: none;
            }
            .addIcon_hover {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>

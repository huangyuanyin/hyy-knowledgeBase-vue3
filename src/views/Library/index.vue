<script lang="ts" setup>
import addIcon from '@/assets/icons/addIcon.svg'
import addIcon_hover from '@/assets/icons/addIcon_hover.svg'
import searchImg from '@/assets/img/search.png'
import emptyImg from '@/assets/img/empty.png'
import { getBookStacksApi } from '@/api/bookstacks'
import { getMineBookApi } from '@/api/library'

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const spaceId = ref('') // 当前空间id
const personalGroupId = ref('') // 个人空间下的团队id
const bookList = ref([]) // 当前空间下的知识库列表
const cBookList = ref([]) // 当前空间下的常用知识库列表
const bookGroup = ref([]) // 当前空间&&当前团队下的知识库分组
const libraryInput = ref('')
const isShowsLibraryDialog = ref(false)

// const { bookList: list, getBookList } = useBook()
const { commonBookList, getCommonList, findCommonItem } = useCommon()

watch(
  () => refreshStroe.isRefreshQuickBookList,
  (newVal) => {
    if (newVal) {
      getCommonBookList()
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
      if (infoStore.currentSidebar === 'Sidebar') {
        getBookStacks()
      }
      setTimeout(() => {
        refreshStroe.setRefreshBookList(false)
      }, 0)
    }
  }
)

watchEffect(() => {
  if (infoStore.currentSidebar === 'Sidebar') {
    spaceId.value = JSON.parse(localStorage.getItem('personalSpaceInfo')).id
  } else {
    spaceId.value = infoStore.currentQuery?.sid
  }
  personalGroupId.value = localStorage.getItem('personalGroupId')
})

// 获取当前空间下的常用知识库列表
const getCommonBookList = async () => {
  await getCommonList('book')
  cBookList.value = commonBookList.value
  findCommonItem('book', bookList.value)
  refreshStroe.setRefreshQuickBookList(false)
}

// 获取当前空间下的知识库列表
const getBook = async () => {
  const params = {
    name: libraryInput.value,
    space: spaceId.value,
    type: 'read' // 可新建；
  }
  const res = await getMineBookApi(params)
  if (res.code === 1000) {
    bookList.value = res.data as any
  } else {
    ElMessage.error(res.msg)
  }
  // await getBookList({ space: spaceId.value })
  // bookList.value = list.value
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
  return list
  // return list.filter((item) => item.group_name !== '公共区')
}

const toSearch = (type) => {
  if (type === 'book') {
    getBook()
  }
}

onMounted(async () => {
  await getBook()
  await getCommonBookList()
  if (infoStore.currentSidebar === 'Sidebar') {
    await getBookStacks()
  }
})
</script>

<template>
  <div class="Library_wrap">
    <div class="header">知识库</div>
    <CommonList :list="cBookList" />
    <div class="library_box">
      <div class="libraryList">
        <SwitchModuleItem
          v-if="infoStore.currentSidebar === 'Sidebar'"
          :moduleType="'operation'"
          :moduleGenre="'my'"
          :moduleGenreData="[
            {
              type: 'my',
              name: '我个人的'
            }
            // {
            //   type: 'public',
            //   name: '邀请协作的'
            // }
          ]"
          @getBookStacks="getBookStacks"
        />
        <SwitchModuleItem
          v-else
          :moduleGenre="'my'"
          :moduleGenreData="[
            // {
            //   type: 'my',
            //   name: '来自团队的'
            // },
            // {
            //   type: 'public',
            //   name: '邀请协作的'
            // }
          ]"
        >
          <template #right>
            <div class="button">
              <el-input v-model="libraryInput" placeholder="搜索知识库" clearable @change="toSearch('book')">
                <template #prefix>
                  <i-ep-Search />
                </template>
              </el-input>
              <el-button @click="isShowsLibraryDialog = true">
                <template #icon>
                  <img class="addIcon" :src="addIcon" alt="" />
                  <img class="addIcon_hover" :src="addIcon_hover" alt="" />
                </template>
                新建知识库
              </el-button>
            </div>
          </template>
        </SwitchModuleItem>
        <LibraryTable v-if="infoStore.currentSidebar === 'Sidebar'" title="知识库" :commonList="cBookList" :group="bookGroup" @getBookStacks="getBookStacks" />
        <TableComp v-else :header="['名称', '归属', '创建人', '更新时间', '']" type="library" :data="filterGroupFromPublic(bookList)" />
        <Empty v-if="infoStore.currentSidebar !== 'Sidebar' && !bookList.length && libraryInput" :img="searchImg" height="60vh" text="搜索结果为空" />
        <Empty v-if="infoStore.currentSidebar !== 'Sidebar' && !bookList.length && !libraryInput" :img="emptyImg" height="60vh" text="暂无知识库" />
        <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Library_wrap {
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
        :deep(.is-focus) {
          border-color: #0bd07d !important;
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

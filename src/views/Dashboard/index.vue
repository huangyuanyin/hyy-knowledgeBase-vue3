<script lang="ts" setup>
import { moduleData, moduleAddMenuData } from '@/data/data'
import empty from '@/assets/img/empty.png'

const infoStore = useInfoStore()
const isShowsLibraryDialog = ref(false)
const isBookListDialog = ref(false)
const isShowSelectTemDialog = ref(false)
const bookListDialogTitle = ref('')
const docType = ref('updateDoc')
const articleList = ref([])
const isEmpty = ref(false)
const isLoading = ref(false)

const { articleList: list, getRecentDocList } = useArticle()

watch(
  () => infoStore.currentSpaceInfo.spacekey,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        handleRecentDocList('updateDoc')
      }, 500)
    }
  }
)

async function handleRecentDocList(type: string, target_type?: string) {
  const params = {
    type,
    space: String(infoStore.currentSpaceInfo.id),
    target_type
  }
  !target_type && delete params.target_type
  isLoading.value = true
  await getRecentDocList(params)
  isLoading.value = false
  articleList.value = list.value
  if (target_type && !articleList.value.length) {
    isEmpty.value = true
  } else {
    isEmpty.value = false
  }
}

const handleModule = (id: number): void => {
  switch (id) {
    case 2:
      isShowsLibraryDialog.value = true
      break
    case 3:
      isShowSelectTemDialog.value = true
      break
    default:
      break
  }
}

const toAddArticle = (val: any): void => {
  isBookListDialog.value = true
  bookListDialogTitle.value = val.label.includes('新建') ? val.label.slice(2) : val.label
}

const changeModule = async (type: string) => {
  docType.value = type
  handleRecentDocList(type)
}

const toSearchDoc = (type) => {
  handleRecentDocList(docType.value, type)
}

onMounted(async () => {
  handleRecentDocList('updateDoc')
})
</script>

<template>
  <div class="Dashboard_wrap">
    <div class="title">开始</div>
    <div class="module">
      <template v-for="module in moduleData" :key="module.id">
        <AddOperationPopver
          v-if="module.id === 1"
          :menuItems="moduleAddMenuData"
          :width="259"
          @toAddDoc="toAddArticle"
          @toAddSheet="toAddArticle"
          @toAddMindmap="toAddArticle"
          @toAddPPT="toAddArticle"
        >
          <ModuleItem :module="module" />
        </AddOperationPopver>
        <ModuleItem :module="module" v-else @click="handleModule(module.id)" />
      </template>
    </div>
    <div class="docTitle">文档</div>
    <SwitchModuleItem
      :moduleType="'search'"
      :moduleGenre="'updateDoc'"
      :moduleGenreData="[
        {
          type: 'updateDoc',
          name: '编辑过'
        },
        {
          type: 'viewDoc',
          name: '浏览过'
        }
      ]"
      @changeModule="changeModule"
      @toSearchDoc="toSearchDoc"
    />
    <TableComp v-if="!isEmpty && !isLoading" :data="articleList" :type="docType" />
    <Empty v-if="isEmpty && !isLoading" text="暂无内容" :img="empty" height="50vh" />
    <Loading v-if="isLoading" text="正在努力加载中..." height="50vh" />
  </div>
  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
  <BookListDialog :show="isBookListDialog" @closeDialog="isBookListDialog = false" :title="bookListDialogTitle" />
  <SelectTemDialog :isShow="isShowSelectTemDialog" @closeDialog="isShowSelectTemDialog = false" />
</template>

<style lang="scss" scoped>
.Dashboard_wrap {
  min-height: 100%;
  margin-bottom: -26px;
  .title {
    font-size: 18px;
    color: #262626;
    margin-bottom: 22px;
  }
  .module {
    display: flex;
    margin-bottom: 28px;
  }
  .docTitle {
    font-size: 16px;
    color: #262626;
    margin-bottom: 16px;
    font-weight: 500;
    height: 32px;
    display: flex;
    align-items: flex-end;
  }
}
</style>

<script lang="ts" setup>
import { addArticleApi } from '@/api/article'
import { getMineBookApi } from '@/api/library'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const dataStore = useDataStore()
const spaceId = ref('')
const spaceType = ref('')
const visible = ref(false)
const bookList = ref([])
const articleType = {
  文档: { type: 'doc', title: '无标题文档', body: '' },
  表格: { type: 'sheet', title: '无标题表格', body: '' },
  脑图: { type: 'mind', title: '无标题脑图', body: '' },
  幻灯片: { type: 'ppt', title: '无标题幻灯片', body: '' },
  新建分组: { type: 'title', title: '新建分组', body: '' }
}

watch(
  () => props.show,
  (newVal: boolean) => {
    visible.value = newVal
    if (newVal) {
      spaceId.value = route.meta.asideComponent === 'SpaceSidebar' ? (route.query.sid as string) : JSON.parse(localStorage.getItem('personalSpaceInfo')).id
      spaceType.value = route.meta.asideComponent === 'SpaceSidebar' ? '组织' : '个人'
      getMineBook()
    }
  }
)

const getMineBook = async () => {
  const params = {
    space: spaceId.value,
    type: 'editor' // 可新建；
  }
  const res = await getMineBookApi(params)
  bookList.value = res.data as any
}

const toAddArticle = (val) => {
  switch (props.title) {
    case '脑图':
      articleType[props.title].body = dataStore.mindMapData
      break
    case '幻灯片':
      articleType[props.title].body = dataStore.pptData
      break
    default:
      break
  }
  addArticle(val, articleType[props.title], null)
}

// 处理新建不同文章逻辑
const addArticle = async (val, article, parent) => {
  const params = {
    title: article.title,
    type: article.type,
    body: article.body,
    parent,
    book: val.id,
    space: spaceId.value,
    public: '1'
  }
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    const spaceName = route.path.split('/')[1]
    const query = {
      lid: val.id,
      lname: val.name,
      aid: res.data.id,
      aname: res.data.title
    }
    const spaceQuery = {
      sid: route.query.sid,
      sname: route.query.sname,
      gid: val.group,
      gname: val.groupname
    }
    ElMessage.success({
      message: '新建成功，正在跳转...',
      duration: 1000
    })
    closeDialog()
    setTimeout(() => {
      router.push({
        path: `${spaceType.value === '个人' ? '' : `/${spaceName}`}/directory/${res.data.type}/${'edit'}`,
        query: {
          ...(spaceType.value === '个人' ? {} : spaceQuery),
          ...query
        }
      })
    }, 500)
  } else {
    ElMessage.error(res.msg)
  }
}

const closeDialog = () => {
  visible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="BookListDialog" v-model="visible" width="520px" @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header">
        <h4 class="text-16px line-24px text-#000" :id="titleId" :class="titleClass">新建{{ props.title }}</h4>
      </div>
    </template>
    <p class="mb-8px font-normal text-#8a8f8d text-14px">选择一个知识库</p>
    <el-input class="rounded-6px mb-12px" placeholder="请输入知识库名称进行搜索">
      <template #prefix>
        <i-ep-Search />
      </template>
    </el-input>
    <ul class="box" max-h-360px overflow-y-auto>
      <li
        v-for="(item, index) in bookList"
        :key="'bookList' + index"
        line-24px
        p-12px
        pr-0
        pl-0
        cursor-pointer
        flex="~"
        items-center
        border="b-1 solid #0000000a"
        hover="bg-#eff0f0"
        @click="toAddArticle(item)"
      >
        <img w-24px h-24px mr-8px :src="item.icon" alt="" /> {{ item.groupname }} / {{ item.name }}
      </li>
    </ul>
  </el-dialog>
</template>

<style lang="scss">
.BookListDialog {
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
  .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-input__wrapper {
    border-radius: 6px !important;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    &:hover {
      border-color: #0bd07d !important;
    }
  }
}
</style>

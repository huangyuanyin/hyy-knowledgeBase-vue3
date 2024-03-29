<script lang="ts" setup>
import { getMineBookApi } from '@/api/library'
import emptyImg from '@/assets/img/empty.png'
import searchImg from '@/assets/img/search.png'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['closeDialog', 'toAddArticle'])

const infoStore = useInfoStore()
const bookName = ref<string>('')
const visible = ref<boolean>(false)
const bookList = ref([])
const isShowUploadDialog = ref(false)
const lid = ref(null)
const lname = ref('')
const gid = ref(null)
const gname = ref('')

watch(
  () => props.show,
  (newVal: boolean) => {
    visible.value = newVal
    if (newVal) {
      getMineBook()
    }
  }
)

const getMineBook = async () => {
  const space = infoStore.currentSidebar === 'Sidebar' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : infoStore.currentQuery?.sid
  const params = {
    space,
    type: 'editor', // 可新建；
    name: bookName.value
  }
  const res = await getMineBookApi(params)
  if (res.code === 1000) {
    bookList.value = res.data as any
  } else {
    ElMessage.error(res.msg)
  }
}

const toAddArticle = async (val) => {
  if (props.type === 'template') {
    return emit('toAddArticle', val)
  } else if (props.type === 'import') {
    isShowUploadDialog.value = true
    lid.value = val.id
    lname.value = val.name
    gid.value = val.group
    gname.value = val.group_name
  } else {
    const params = {
      book: val,
      title: props.title
    }
    useArticle().handleAddArticle(params, () => {
      ElMessage.success({
        message: '新建成功，正在跳转...',
        duration: 1000
      })
      closeDialog()
    })
  }
}

const closeDialog = () => {
  visible.value = false
  bookName.value = ''
  lid.value = null
  lname.value = ''
  gid.value = null
  gname.value = ''
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="BookListDialog" v-model="visible" width="520px" @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header">
        <h4 class="text-16px line-24px text-#000" :id="titleId" :class="titleClass">{{ ['从模板新建', '导入...'].includes(props.title) ? '' : '新建' }}{{ props.title }}</h4>
      </div>
    </template>
    <p class="mb-8px font-normal text-#8a8f8d text-14px">选择一个知识库</p>
    <el-input class="rounded-6px mb-12px" v-model="bookName" clearable placeholder="请输入知识库名称进行搜索" @change="getMineBook()">
      <template #prefix>
        <i-ep-Search />
      </template>
    </el-input>
    <ul max-h-360px overflow-y-auto>
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
        <img w-24px h-24px mr-8px :src="item.icon" alt="" />
        <p max-w-19vw overflow-hidden text-ellipsis whitespace-nowrap>{{ item.name }}</p>
        /
        <p overflow-hidden text-ellipsis whitespace-nowrap>{{ item.group_name }}</p>
      </li>
    </ul>
    <Empty v-if="!bookList.length" :img="bookName ? searchImg : emptyImg" height="25vh" :text="bookName ? '搜索结果为空' : '暂无可选知识库'" />
  </el-dialog>
  <UploadFileDialog :isShow="isShowUploadDialog" @closeDialog="isShowUploadDialog = false" :lid="lid" :lname="lname" :gid="gid" :gname="gname" />
</template>

<style lang="scss">
.BookListDialog {
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
  .el-dialog__header {
    border-bottom: none;
  }
  .el-dialog__body {
    padding: 0px !important;
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

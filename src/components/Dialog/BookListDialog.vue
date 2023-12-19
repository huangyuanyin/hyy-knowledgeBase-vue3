<script lang="ts" setup>
import { getMineBookApi } from '@/api/library'
import { useArticle } from '@/hooks/useArticle'

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

const visible = ref(false)
const bookList = ref([])

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
  const params = {
    space: useArticle().space,
    type: 'editor' // 可新建；
  }
  const res = await getMineBookApi(params)
  bookList.value = res.data as any
}

const toAddArticle = async (val) => {
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
        {{ item.groupname }} / {{ item.name }}
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

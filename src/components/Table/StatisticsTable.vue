<script lang="ts" setup>
import documentIcon from '@/assets/icons/documentIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['changeTab'])

const route = useRoute()
const tab = ref([])
const tabColumns = ref()
const currentTable = ref([])
const currentTab = ref('')
const search = ref('')
const searchPlcae = ref({
  memberCol: '搜索成员',
  bookCol: '搜索知识库',
  docCol: '搜索文档'
})
const contentType = ref({
  doc: documentIcon,
  sheet: formIcon,
  mind: mindmapIcon,
  ppt: pptIcon
})

watchEffect(() => {
  if (route.meta.asideComponent === 'BookSidebar') {
    tab.value = [{ label: '文档明细', value: 'docCol' }]
    tabColumns.value = {
      docCol: [
        { prop: 'title', label: '文档名称', width: 200 },
        { prop: 'creator_name', label: '创建者' },
        { prop: 'create_datetime', label: '创建时间', width: 200 },
        { prop: 'update_datetime', label: '更新时间', width: 200 },
        { prop: 'views', label: '阅读量' },
        { prop: 'comments_count', label: '评论量' },
        { prop: 'likes_count', label: '点赞量' }
      ]
    }
    currentTab.value = 'docCol'
    currentTable.value = tabColumns.value.docCol
  } else {
    tab.value = [
      { label: '成员明细', value: 'memberCol' },
      { label: '知识库明细', value: 'bookCol' },
      { label: '文档明细', value: 'docCol' }
    ]
    tabColumns.value = {
      memberCol: [
        { prop: 'creator', label: '成员名称', width: 200 },
        { prop: 'content_count', label: '文档数' },
        { prop: 'read_count', label: '阅读数' },
        { prop: 'comment_count', label: '评论数' },
        { prop: 'like_count', label: '点赞数' },
        { prop: 'mark_count', label: '收藏数' }
      ],
      bookCol: [
        { prop: 'name', label: '知识库名称', width: 200 },
        { prop: 'word_count', label: '字数' },
        { prop: 'content_count', label: '文档数' },
        { prop: 'read_count', label: '阅读量' },
        { prop: 'like_count', label: '点赞量' },
        { prop: 'comment_count', label: '评论量' }
      ],
      docCol: [
        { prop: 'title', label: '文档名称', width: 200 },
        { prop: 'creator', label: '创建者', width: 120 },
        { prop: 'create_datetime', label: '创建时间' },
        { prop: 'update_datetime', label: '更新时间' },
        { prop: 'word_count', label: '字数', width: 70 },
        { prop: 'read_count', label: '阅读量', width: 70 },
        { prop: 'comments_count', label: '评论量', width: 70 },
        { prop: 'likes_count', label: '点赞量', width: 70 }
      ]
    }
    currentTab.value = 'memberCol'
    currentTable.value = tabColumns.value.memberCol
  }
})

const toChangeTab = (val) => {
  currentTab.value = val
  currentTable.value = tabColumns.value[val]
  emit('changeTab', val)
}
</script>

<template>
  <div mt-56px>
    <div flex items-center justify-between>
      <div>
        <span
          :class="['tab', item.value === currentTab ? 'tab-active' : '']"
          cursor-pointer
          text-16px
          text="#585a5a"
          line-height-24px
          v-for="(item, index) in tab"
          :key="'tab' + index"
          @click="toChangeTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <div flex items-center>
        <el-input class="search" v-model="search" :placeholder="searchPlcae[currentTab]" clearable>
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
        <el-button class="button" w-60px h-32px rounded-6px cursor-pointer>导出</el-button>
      </div>
    </div>
    <el-table :data="props.tableData" stripe empty-text="暂无数据" mt-40px w-full>
      <el-table-column v-for="(column, index) in currentTable" :key="'tabColumn' + index" :prop="column.prop" :label="column.label" :width="column.width as number || undefined">
        <template #default="{ row }">
          <div flex items-center h-56px v-if="column.prop === 'title'">
            <img w-20px h-20px mr-4px :src="contentType[row.type]" alt="" class="icon" />
            <span>{{ row.title }}</span>
          </div>
          <div flex items-center h-56px v-else-if="column.prop === 'name'">
            <img w-24px h-24px mr-8px :src="row.icon" alt="" class="icon" />
            <span>{{ row.name }}</span>
          </div>
          <span flex items-center v-else line-height-56px h-56px>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  margin-left: 32px;
  &:first-child {
    margin-left: 0;
  }
}
.tab-active {
  color: #262626;
  font-weight: 700;
}
.search {
  margin: 0 16px;
  width: 200px;
  :deep(.el-input__wrapper) {
    border-radius: 6px !important;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    &:hover {
      border-color: #0bd07d !important;
    }
  }
}
.button {
  &:hover {
    color: #009456;
    border-color: #009456;
    background-color: #fff;
  }
}
</style>

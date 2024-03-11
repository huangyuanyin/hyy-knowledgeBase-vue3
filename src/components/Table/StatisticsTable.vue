<script lang="ts" setup>
import documentIcon from '@/assets/icons/documentIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'
import fileIcon from '@/assets/icons/fileIcon.svg'
import folderIcon from '@/assets/icons/folder.svg'
import { rangeList } from '@/data/data'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['changeTab', 'toSearch', 'changePage'])

const route = useRoute()
const tab = ref([])
const tabColumns = ref()
const currentTable = ref([])
const currentTab = ref('')
const search = ref('')
const currentPage = ref(1)
const currentRangeType = ref('全部')
const currentRange = ref('0')
const searchPlcae = ref({
  memberCol: '搜索成员',
  bookCol: '搜索知识库',
  docCol: '搜索文档',
  teamCol: '搜索团队'
})
const contentType = ref({
  title: folderIcon,
  doc: documentIcon,
  sheet: formIcon,
  mind: mindmapIcon,
  ppt: pptIcon,
  file: fileIcon
})
const tipList = ref({
  memberCol: '仅筛选文档新建',
  bookCol: '仅筛选点赞量、收藏量、评论量',
  docCol: '仅筛选点赞量、评论量',
  teamCol: '仅筛选点赞量、收藏量、评论量'
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
        { prop: 'read_count', label: '阅读量' },
        { prop: 'comments_count', label: '评论量' },
        { prop: 'likes_count', label: '点赞量' }
      ]
    }
    currentTab.value = 'docCol'
    currentTable.value = tabColumns.value.docCol
  } else if (route.meta.asideComponent === 'TeamSidebar') {
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
        { prop: 'name', label: '知识库名称' },
        { prop: 'word_count', label: '字数', width: 150 },
        { prop: 'content_count', label: '文档数', width: 150 },
        { prop: 'read_count', label: '获阅读量', width: 150 },
        { prop: 'like_count', label: '获赞数', width: 150 },
        { prop: 'comment_count', label: '评论量', width: 150 }
      ],
      docCol: [
        { prop: 'title', label: '文档名称', width: 200 },
        { prop: 'creator', label: '创建者', width: 120 },
        { prop: 'create_datetime', label: '创建时间' },
        { prop: 'update_datetime', label: '更新时间' },
        { prop: 'word_count', label: '字数', width: 70 },
        { prop: 'read_count', label: '获阅读量', width: 90 },
        { prop: 'likes_count', label: '获赞数', width: 70 },
        { prop: 'comments_count', label: '评论量', width: 70 }
      ]
    }
    currentTab.value = 'memberCol'
    currentTable.value = tabColumns.value.memberCol
  } else if (route.meta.asideComponent === 'OrganizeSidebar') {
    tab.value = [
      { label: '成员明细', value: 'memberCol' },
      { label: '团队明细', value: 'teamCol' }
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
      teamCol: [
        { prop: 'name', label: '团队名称' },
        { prop: 'create_datetime', label: '创建时间', width: 200 },
        { prop: 'member_count', label: '成员数', width: 100 },
        { prop: 'book_count', label: '知识库数', width: 100 },
        { prop: 'content_count', label: '文档数', width: 100 },
        { prop: 'read_count', label: '阅读量', width: 100 },
        { prop: 'like_count', label: '点赞量', width: 100 },
        { prop: 'comment_count', label: '评论量', width: 100 }
      ]
    }
    currentTab.value = 'memberCol'
    currentTable.value = tabColumns.value.memberCol
  }
})

const toChangeTab = (val) => {
  currentTab.value = val
  currentTable.value = tabColumns.value[val]
  search.value = ''
  currentRangeType.value = '全部'
  currentRange.value = '0'
  currentPage.value = 1
  emit('changeTab', val)
}

const toSearch = () => {
  emit('toSearch', [currentTab.value, search.value, currentRange.value])
}

const changePage = (val) => {
  currentPage.value = val
  emit('changePage', [currentTab.value, val])
}

const toSearchByRange = (val) => {
  currentRangeType.value = val.label
  currentRange.value = val.value
  emit('toSearch', [currentTab.value, search.value, val.value])
}

const toExport = () => {
  ElMessage.warning('功能暂未开放，敬请期待！')
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
        <LibraryOperationPopver :selectMenu="currentRangeType" :menuItems="rangeList" placement="bottom-end" :height="42" :width="120" @toSearchByRange="toSearchByRange">
          <div class="search-item" flex items-center>
            <el-tooltip effect="dark" :content="tipList[currentTab]" placement="top" :show-arrow="false">
              <span flex items-center cursor-pointer text-15px text="#262626">{{ currentRangeType }}<img src="/src/assets/icons/downIcon.svg" alt="" /></span>
            </el-tooltip>
          </div>
        </LibraryOperationPopver>
        <el-input class="search" v-model="search" :placeholder="searchPlcae[currentTab]" clearable @change="toSearch">
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
        <el-button class="button" w-60px h-32px rounded-6px cursor-pointer @click="toExport">导出</el-button>
      </div>
    </div>
    <el-table :data="props.tableData" stripe :empty-text="search ? '搜索结果为空' : '暂无数据'" mt-40px w-full>
      <el-table-column v-for="(column, index) in currentTable" :key="'tabColumn' + index" :prop="column.prop" :label="column.label" :width="column.width as number || undefined">
        <template #default="{ row }">
          <div flex items-center h-56px v-if="column.prop === 'creator'">
            <img w-20px h-20px mr-4px :src="'http://10.4.150.56:8032/' + row.avatar" alt="" class="icon" />
            <span max-w-200px overflow-hidden text-ellipsis whitespace-nowrap ml-4px>{{ row.creator }}</span>
          </div>
          <div flex items-center h-56px v-else-if="column.prop === 'title'">
            <img w-20px h-20px mr-4px :src="contentType[row.type]" alt="" class="icon" />
            <span max-w-200px overflow-hidden text-ellipsis whitespace-nowrap>{{ row.title }}</span>
          </div>
          <div flex items-center h-56px v-else-if="column.prop === 'name'">
            <img w-24px h-24px mr-8px :src="row.icon" alt="" class="icon" />
            <el-tooltip effect="light" :content="row.name" placement="bottom-start" :hide-after="0" :show-after="1000" :show-arrow="false">
              <span max-w-250px overflow-hidden text-ellipsis whitespace-nowrap>{{ row.name }}</span>
            </el-tooltip>
          </div>
          <span flex items-center v-else line-height-56px h-56px>{{ row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination flex justify-end mt-20px background layout="prev, pager, next" v-model="currentPage" @change="changePage" :total="props.total" />
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
:deep(.el-input) {
  .is-focus {
    border-color: #0bd07d !important;
  }
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
:deep(.el-pagination) {
  li,
  button {
    border-radius: 6px !important;
    border: 1px solid #d9d9d9 !important;
    background-color: #fff !important;
    &:hover {
      border-color: #0bd07d !important;
      color: #0bd07d !important;
    }
  }
  .is-active {
    border: 1px solid #00b96b !important;
    color: #00b96b !important;
  }
}
</style>

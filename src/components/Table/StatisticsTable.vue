<script lang="ts" setup>
const route = useRoute()
const tab = ref([])
const tabColumns = ref()
const currentTable = ref([])
const currentTab = ref('')
const search = ref('')
const tableData = ref([])

watchEffect(() => {
  if (route.meta.asideComponent === 'BookSidebar') {
    tab.value = [{ label: '文档明细', value: 'docCol' }]
    tabColumns.value = {
      docCol: [
        { prop: 'name', label: '文档名称', width: 200 },
        { prop: 'address', label: '创建者' },
        { prop: 'address', label: '创建时间' },
        { prop: 'address', label: '更新时间' },
        { prop: 'address', label: '字数' },
        { prop: 'address', label: '阅读量' },
        { prop: 'address', label: '评论量' },
        { prop: 'address', label: '点赞量' }
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
        { prop: 'name', label: '成员名称', width: 200 },
        { prop: 'name', label: '编辑文档数' },
        { prop: 'address', label: '编辑次数' },
        { prop: 'address', label: '获阅读量' },
        { prop: 'address', label: '获赞数' }
      ],
      bookCol: [
        { prop: 'name', label: '知识库名称', width: 200 },
        { prop: 'address', label: '最近更新' },
        { prop: 'address', label: '字数' },
        { prop: 'address', label: '文档数' },
        { prop: 'address', label: '阅读量' },
        { prop: 'address', label: '点赞量' },
        { prop: 'address', label: '评论量' }
      ],
      docCol: [
        { prop: 'name', label: '文档名称', width: 200 },
        { prop: 'address', label: '创建者' },
        { prop: 'address', label: '创建时间' },
        { prop: 'address', label: '更新时间' },
        { prop: 'address', label: '字数' },
        { prop: 'address', label: '阅读量' },
        { prop: 'address', label: '评论量' },
        { prop: 'address', label: '点赞量' }
      ]
    }
    currentTab.value = 'memberCol'
    currentTable.value = tabColumns.value.memberCol
  }
})

const toChangeTab = (val) => {
  currentTab.value = val
  currentTable.value = tabColumns.value[val]
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
        <el-input class="search" v-model="search" placeholder="搜索成员" clearable>
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
        <el-button class="button" w-60px h-32px rounded-6px cursor-pointer>导出</el-button>
      </div>
    </div>
    <el-table :data="tableData" stripe empty-text="暂无数据" mt-40px w-full>
      <el-table-column v-for="(column, index) in currentTable" :key="'tabColumn' + index" :prop="column.prop" :label="column.label" :width="column.width as number || undefined" />
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

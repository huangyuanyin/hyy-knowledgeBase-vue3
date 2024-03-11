<script lang="ts" setup>
import { WarningFilled, Search } from '@element-plus/icons-vue'
import { contentType } from '@/data/data'
import { getMyRecyclesApi, deleteMyRecyclesApi, recoverMyRecyclesApi } from '@/api/recycles'

type RecycleData = {
  id: number
  title: string
  creator_name: string
  create_datetime: string
  type: string
}

const route = useRoute()
const infoStore = useInfoStore()
const spaceId = ref('')
const showHandleArticleDialog = ref(false)
const recycleData = ref([])
const handleData = ref(null)
const name = ref('')

watchEffect(() => {
  spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : infoStore.currentQuery?.sid
})

watch(
  () => route.path,
  () => {
    if (route.path.includes('recycles')) {
      getMyRecycles()
    }
  }
)

const toRecover = (row: RecycleData) => {
  if (row.type === 'article') {
    handleData.value = row
    showHandleArticleDialog.value = true
  } else {
    recoverSpaceRecycles(row.id, row.type)
  }
}

const toDelete = (row: RecycleData) => {
  deleteBookRecycles(row.id, row.type)
}

const handleRecover = async (data) => {
  const { target_id, action, node_id } = data
  let res = await recoverMyRecyclesApi(node_id, { target_id, action, type: 'article' })
  if (res.code === 1000) {
    showHandleArticleDialog.value = false
    ElMessage.success('恢复成功')
    getMyRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const getMyRecycles = async () => {
  const params = {
    space: spaceId.value,
    name: name.value
  }
  let res = await getMyRecyclesApi(params)
  if (res.code === 1000) {
    recycleData.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const recoverSpaceRecycles = async (id, type) => {
  let res = await recoverMyRecyclesApi(id, { type })
  if (res.code === 1000) {
    ElMessage.success('恢复成功')
    getMyRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteBookRecycles = async (id, type) => {
  let res = await deleteMyRecyclesApi(id, { type })
  if (res.code === 1000) {
    ElMessage.success('彻底删除成功')
    getMyRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getMyRecycles()
})
</script>

<template>
  <div class="Recycles_wrap">
    <div class="header">
      <span>回收站</span>
      <div>
        <el-input v-model="name" @change="getMyRecycles" width="200px" clearable :prefix-icon="Search" placeholder="搜索回收站"></el-input>
      </div>
    </div>
    <div class="box">
      <el-table :data="recycleData" style="width: 100%" :empty-text="name ? '搜索结果为空' : '暂无数据'">
        <el-table-column prop="name" label="名称">
          <template #default="{ row }">
            <div class="name">
              <img :src="row.type === 'article' ? contentType[row.sub_type] : row.icon" alt="" class="icon" />
              <p max-w-25vw overflow-hidden text-ellipsis whitespace-nowrap>{{ row.name }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="归属">
          <template #default="{ row }">
            <div class="Belong">
              <span v-if="row.type === 'article'">{{ row.group_name }} / </span>
              <span v-else>{{ row.groupname }}</span>
              <span v-if="row.type === 'article'">{{ row.book_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="update_datetime" label="删除时间" width="220" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button type="primary" text @click="toRecover(row)">恢复</el-button>
            <el-popconfirm
              width="152"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="toDelete(row)"
              :icon="WarningFilled"
              icon-color="#ECAA04"
              title="确认彻底删除？"
            >
              <template #reference>
                <el-button type="danger" text>彻底删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <HandleArticleDialog :show="showHandleArticleDialog" title="恢复文档" desc="" :data="handleData" @closeDialog="showHandleArticleDialog = false" @recover="handleRecover" />
</template>

<style lang="scss" scoped>
.Recycles_wrap {
  min-height: 100%;
  margin-bottom: -26px;
  .header {
    font-size: 18px;
    color: #262626;
    line-height: 28px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      height: 32px;
      :deep(.el-input) {
        .is-focus {
          border-color: #0bd07d !important;
        }
      }
      :deep(.el-input__wrapper) {
        width: 10vw;
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
    }
  }
  .box {
    :deep(.el-table__row) {
      height: 57px;
    }
    .name {
      display: flex;
      align-items: center;
      .icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }
  }
}
</style>

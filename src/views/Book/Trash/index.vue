<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'
import { contentType } from '@/data/data'
import { getBookRecyclesApi, recoverBookRecyclesApi, deleteBookRecyclesApi } from '@/api/recycles'

type RecycleData = {
  id: number
  title: string
  creator_name: string
  create_datetime: string
}

type recoverData = {
  target_id: number
  action: string
  node_id: number
}

const infoStore = useInfoStore()
const showHandleArticleDialog = ref(false)
const handleData = ref(null) // 恢复的数据
const recycleData: Ref<RecycleData[]> = ref([])

const toRecover = (row: RecycleData) => {
  handleData.value = row
  showHandleArticleDialog.value = true
}

const handleRecover = (data: recoverData) => {
  recoverBookRecycles(data)
}

const toDelete = (row: RecycleData) => {
  deleteBookRecycles(row.id)
}

const recoverBookRecycles = async (data) => {
  const { target_id, action, node_id } = data
  let res = await recoverBookRecyclesApi(node_id, { target_id, action })
  if (res.code === 1000) {
    showHandleArticleDialog.value = false
    ElMessage.success('恢复成功')
    getBookRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteBookRecycles = async (id) => {
  let res = await deleteBookRecyclesApi(id)
  if (res.code === 1000) {
    ElMessage.success('彻底删除成功')
    getBookRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const getBookRecycles = async () => {
  const params = {
    book: infoStore.currentQuery?.lid
  }
  let res = await getBookRecyclesApi(params)
  if (res.code === 1000) {
    recycleData.value = res.data as RecycleData[]
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getBookRecycles()
})
</script>

<template>
  <div class="Trash_wrap">
    <div class="header">
      <span>回收站</span>
      <div>
        <el-input placeholder="搜索回收站" disabled></el-input>
      </div>
    </div>
    <div class="box">
      <el-table :data="recycleData" style="width: 100%" empty-text="暂无数据">
        <el-table-column label="名称">
          <template #default="{ row }">
            <div class="name">
              <img :src="contentType[row.type]" alt="" class="icon" />
              <p max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ row.title }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creator_name" label="操作者" width="200" />
        <el-table-column prop="create_datetime" label="删除时间" width="220" />
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
.Trash_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      height: 32px;
      :deep(.el-input__wrapper) {
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
    max-width: 1080px;
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

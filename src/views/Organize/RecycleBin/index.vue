<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'
import { getSpaceRecyclesApi, recoverSpaceRecyclesApi, deleteSpaceRecyclesApi } from '@/api/recycles'

type RecycleData = {
  id: number
  groupname: string
  creator_name: string
  create_datetime: string
}

const infoStore = useInfoStore()
const recycleData: Ref<RecycleData[]> = ref([])

const toRecover = (row: RecycleData) => {
  recoverSpaceRecycles(row.id)
}

const toDelete = (row: RecycleData) => {
  deleteSpaceRecycles(row.id)
}

const recoverSpaceRecycles = async (id) => {
  let res = await recoverSpaceRecyclesApi(id)
  if (res.code === 1000) {
    ElMessage.success('恢复成功')
    getSpaceRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteSpaceRecycles = async (id) => {
  let res = await deleteSpaceRecyclesApi(id)
  if (res.code === 1000) {
    ElMessage.success('彻底删除成功')
    getSpaceRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpaceRecycles = async () => {
  const params = {
    space: infoStore.currentQuery?.sid
  }
  let res = await getSpaceRecyclesApi(params)
  if (res.code === 1000) {
    recycleData.value = res.data as RecycleData[]
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getSpaceRecycles()
})
</script>

<template>
  <div class="RecycleBin_wrap">
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
              <img :src="row.icon" alt="" class="icon" />
              <p max-w-20vw overflow-hidden text-ellipsis whitespace-nowrap>{{ row.groupname }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="modifier_name" label="操作者" width="200" />
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
</template>

<style lang="scss" scoped>
.RecycleBin_wrap {
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

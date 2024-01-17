<script lang="ts" setup>
import { getTeamRecyclesApi, recoverTeamRecyclesApi, deleteTeamRecyclesApi } from '@/api/recycles'

type RecycleData = {
  id: number
  name: string
  creator_name: string
  create_datetime: string
}

const infoStore = useInfoStore()
const recycleData: Ref<RecycleData[]> = ref([])

const toRecover = (row: RecycleData) => {
  recoverSpaceRecycles(row.id)
}

const toDelete = (row: RecycleData) => {
  ElMessageBox.confirm('彻底删除后，下属文档也将无法恢复', `确认彻底删除【${row.name}】知识库？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'submitBtn',
    cancelButtonClass: 'cancelBtn',
    customClass: 'deleteTrashDialog'
  })
    .then(() => {
      deleteSpaceRecycles(row.id)
    })
    .catch(() => {})
}

const recoverSpaceRecycles = async (id) => {
  let res = await recoverTeamRecyclesApi(id)
  if (res.code === 1000) {
    ElMessage.success('恢复成功')
    getSpaceRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteSpaceRecycles = async (id) => {
  let res = await deleteTeamRecyclesApi(id)
  if (res.code === 1000) {
    ElMessage.success('彻底删除成功')
    getSpaceRecycles()
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpaceRecycles = async () => {
  const params = {
    group: infoStore.currentQuery?.gid
  }
  let res = await getTeamRecyclesApi(params)
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
              <img :src="row.icon" alt="" class="icon" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="modifier_name" label="操作者" width="200" />
        <el-table-column prop="creator_name" label="归属" width="220">
          <template #default="{ row }">
            <div class="Belong">
              <span>{{ row.group_name }}</span> /
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_datetime" label="删除时间" width="220" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" text @click="toRecover(row)">恢复</el-button>
            <el-button type="danger" text @click="toDelete(row)">彻底删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
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
    .belong {
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="scss">
.deleteTrashDialog {
  .submitBtn,
  .cancelBtn {
    margin-left: 8px;
    border-radius: 6px;
    box-shadow: none;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
  }
  .submitBtn {
    color: #fff;
    background: #00b96b;
    border-color: #00b96b;
  }
  .cancelBtn {
    color: #262626;
    background: #fff;
    border-color: #e7e9e8;
    &:hover {
      color: #00b96b;
      border-color: #00b96b;
    }
  }
}
</style>

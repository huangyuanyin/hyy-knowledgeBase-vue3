<script lang="ts" setup>
import { getSpacepermissionsApi } from '@/api/spacepermissions'

const route = useRoute()
const searchInput = ref('')
const memberData = ref([])

const getSpacepermissions = async () => {
  const params = {
    space: route.query.sid
  }
  const res = await getSpacepermissionsApi(params)
  if (res.code === 1000) {
    memberData.value = res.data
  }
}

onMounted(() => {
  getSpacepermissions()
})
</script>

<template>
  <div class="AddressBook_wrap">
    <div class="header">通讯录</div>
    <div class="box">
      <SwitchModuleItem
        :moduleType="'search'"
        moduleGenre="member"
        :moduleGenreData="[
          {
            type: 'member',
            name: '空间成员'
          },
          {
            type: 'contacts',
            name: '公司成员'
          }
        ]"
      >
        <template #right>
          <div class="button">
            <el-input v-model="searchInput" placeholder="搜索成员" clearable>
              <template #prefix>
                <i-ep-Search />
              </template>
            </el-input>
            <el-button> 添加成员 </el-button>
          </div>
        </template>
      </SwitchModuleItem>
      <el-table :data="memberData" stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="permusername" label="姓名" width="180" />
        <el-table-column prop="dept" label="所在部门" width="180" />
        <el-table-column prop="permtype" label="身份" width="180">
          <template #default="{ row }">
            <span v-if="row.permtype === '0'">管理员</span>
            <span v-else>成员</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180" />
        <el-table-column prop="update_time" label="加入时间" width="120" />
        <el-table-column fixed="right" label="操作">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">详情</el-button>
            <el-button link type="primary" size="small">离开</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AddressBook_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    .button {
      display: flex;
      align-items: center;
      color: #262626;
      .el-input {
        margin-right: 12px;
        max-width: 164px;
      }
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
      .el-button {
        border-radius: 6px;
        color: #fff;
        border-color: #00b96b;
        background-color: #00b96b;
        &:hover {
          border-color: #009456;
          background-color: #009456;
        }
      }
    }
  }
}
</style>

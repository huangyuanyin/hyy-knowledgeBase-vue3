<script lang="ts" setup>
import { editSpacepermissionsApi, getSpacepermissionsApi } from '@/api/spacepermissions'

const infoStore = useInfoStore()
const user = JSON.parse(localStorage.getItem('xinAn-userInfo')).username || ''
const isShowAddAdminDialog = ref(false)
const adminData = ref([])
const myData = ref([])

const getSpacepermissions = async () => {
  const params = {
    space: infoStore.currentQuery.sid as string,
    permtype: '0' // 0：管理员  1：成员
  }
  const res = await getSpacepermissionsApi(params)
  if (res.code === 1000) {
    adminData.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const getUser = async () => {
  const user = JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).user
  user.permname = user.name
  user.permusername = user.username
  user.permtype = '0'
  user.dept = user.dept_name
  myData.value = [user]
}

const toDeleteAdmin = (item) => {
  console.log(`output->item`, item)
  deleteSpacepermissions(item.id, item.permusername)
}

const deleteSpacepermissions = async (id: number, permusername) => {
  const params = {
    permusername,
    space: infoStore.currentQuery.sid as string,
    permtype: '1'
  }
  const res = await editSpacepermissionsApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('已从管理员中移除')
    await getSpacepermissions()
    await handleMember()
  } else {
    ElMessage.error(res.msg)
  }
}

const handleMember = () => {
  adminData.value = [...myData.value, ...adminData.value]
}

const closeDialog = async (val: boolean) => {
  isShowAddAdminDialog.value = false
  if (!val) return
  await getSpacepermissions()
  await handleMember()
}

onMounted(async () => {
  await getUser()
  await getSpacepermissions()
  await handleMember()
})
</script>

<template>
  <div class="Administrator_wrap">
    <div class="header">
      <span>管理员设置</span>
      <el-button @click="isShowAddAdminDialog = true">添加</el-button>
    </div>
    <div class="box">
      <el-table :data="adminData" stripe style="width: 100%">
        <el-table-column prop="permname" label="姓名" width="350">
          <template #default="{ row }">
            <span>
              {{ row.permname }}
              <span v-if="user === row.permusername" class="my_tag">你自己</span>
              <span v-if="user !== row.permusername && row.permusername == myData[0].permusername" class="my_tag">创建人</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="permusername" label="用户名" width="250" align="center" />
        <el-table-column prop="role" label="角色" width="250" align="center">
          <template #default="">
            <span>管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" v-if="user !== row.permusername && row.permusername !== myData[0].permusername" @click="toDeleteAdmin(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <AddAdminDialog :isShow="isShowAddAdminDialog" @closeDialog="closeDialog" />
</template>

<style lang="scss" scoped>
.Administrator_wrap {
  margin: auto;
  max-width: 124vh;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .box {
    max-width: 124vh;
    .my_tag {
      margin-left: 8px;
      background-color: #eff0f0;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 12px;
      color: #585a5a;
    }
  }
}
</style>

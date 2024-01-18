<script lang="ts" setup>
import { deleteSpacepermissionsApi, getSpacepermissionsApi } from '@/api/spacepermissions'
import { getUserApi } from '@/api/user'

const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const nickname = JSON.parse(localStorage.getItem('userInfo')).nickname || ''
const avatar = 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || ''
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const searchInput = ref('')
const memberData = ref([])
const myData = ref([])
const isShowTeamDialog = ref(false)
const loadTable = ref(false)

watchEffect(async () => {
  if (refreshStroe.isRefreshSpaceMember) {
    await getSpacepermissions()
    await handleMember()
    refreshStroe.setRefreshSpaceMember(false)
  }
})

const getSpacepermissions = async () => {
  const params = {
    space: infoStore.currentQuery?.sid
  }
  loadTable.value = true
  const res = await getSpacepermissionsApi(params)
  loadTable.value = false
  if (res.code === 1000) {
    memberData.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteSpacepermissions = async (id: number) => {
  const res = await deleteSpacepermissionsApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    await getSpacepermissions()
    await handleMember()
  } else {
    ElMessage.error(res.msg)
  }
}

const getUser = async () => {
  const params = {
    username: user
  }
  const res = await getUserApi(params)
  if (res.code === 1000) {
    res.data.map((it) => {
      if (it.username === user) {
        it.permname = it.name
        it.permtype = '0'
        it.dept = it.dept_name
      }
    })
    myData.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const toExit = (data: any) => {
  ElMessageBox.confirm(`确定删除【${data.permname}】吗？删除后对方就无法再访问本团队`, '确定删除该成员？', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    customClass: 'deleteMemberDialog',
    confirmButtonClass: 'deleteButton',
    cancelButtonClass: 'cancelButton',
    appendTo: '.AddressBook_wrap',
    showClose: false,
    type: 'warning'
  })
    .then(() => {
      deleteSpacepermissions(data.id)
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

const toDetail = (data: any) => {
  console.log(`output->data`, data)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const handleMember = () => {
  memberData.value = [...myData.value, ...memberData.value]
}

onMounted(async () => {
  await getSpacepermissions()
  await getUser()
  await handleMember()
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
            <el-button @click="isShowTeamDialog = true"> 添加成员 </el-button>
          </div>
        </template>
      </SwitchModuleItem>
      <el-table :data="memberData" stripe style="width: 100%" max-height="75vh" v-loading="loadTable" element-loading-text="加载成员中...">
        <el-table-column type="selection" width="55" />
        <el-table-column label="姓名" width="180">
          <template #default="{ row }">
            <div flex items-center>
              <span h-40px flex items-center justify-center mr-8px>
                <img v-if="nickname === row.permname" w-24px h-24px :src="avatar" alt="" />
                <img v-else w-24px h-24px :src="row.avatar" alt="" />
              </span>
              <span>
                {{ row.permname }}
                <span v-if="nickname === row.permname" class="my_tag">你自己</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="所在部门" width="180" />
        <el-table-column prop="permtype" label="身份" width="150">
          <template #default="{ row }">
            <span v-if="row.permtype === '0'">管理员</span>
            <span v-else>成员</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column label="加入时间" width="200">
          <template #default="{ row }">
            <span v-if="row.permtype === '1'">{{ row.update_datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="toDetail(row)" v-if="nickname !== row.permname">详情</el-button>
            <el-button link type="danger" size="small" @click="toExit(row)" v-if="nickname !== row.permname">离开</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <MemberDialog :isShow="isShowTeamDialog" @closeDialog="isShowTeamDialog = false" :spaceMember="memberData" />
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
    .my_tag {
      margin-left: 8px;
      background-color: #eff0f0;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 12px;
      color: #585a5a;
    }
  }
  :deep(.deleteMemberDialog) {
    .deleteButton,
    .cancelButton {
      margin-left: 8px;
      border-radius: 6px;
      box-shadow: none;
      height: 32px;
      padding: 4px 15px;
      font-size: 14px;
      margin-top: 24px;
    }
    .deleteButton {
      color: #df2a3f;
      background: #fff;
      border-color: #df2a3f;
    }
    .cancelButton {
      color: #262626;
      background: #fff;
      border-color: #e7e9e8;
    }
  }
}
</style>

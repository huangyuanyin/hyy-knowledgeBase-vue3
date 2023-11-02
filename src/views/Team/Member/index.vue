<script lang="ts" setup>
import { deleteTeamMemberApi, getTeamMemberApi } from '@/api/member'
import { VxeTableInstance, VxeColumnPropTypes } from 'vxe-table'

interface MemberItem {
  id: number
  username: string
  role: string
  group: number
  status: string
  update_datetime: string
}

const route = useRoute()
const refreshStore = useRefreshStore()
const memberInput = ref('')
const xTable = ref<VxeTableInstance<MemberItem>>()
const memberList = ref<MemberItem[]>([])
const memberTotal = ref(0)
const isShowAddMemberDialog = ref(false)
const sexList = [
  { label: '管理员', value: '0' },
  { label: '成员', value: '1' },
  { label: '成员', value: '2' }
]
const statusList = [
  { label: '正常', value: '1' },
  { label: '注销', value: '0' }
]

watchEffect(() => {
  if (refreshStore.isRefreshTeamMember) {
    getTeamMember()
    refreshStore.isRefreshTeamMember = false
  }
})

const formatterRole: VxeColumnPropTypes.Formatter<MemberItem> = ({ cellValue }) => {
  const item = sexList.find((item) => item.value === cellValue)
  return item ? item.label : cellValue
}

const formatterStatus: VxeColumnPropTypes.Formatter<MemberItem> = ({ cellValue }) => {
  const item = statusList.find((item) => item.value === cellValue)
  return item ? item.label : cellValue
}

const toDeleteMmber = (data) => {
  ElMessageBox.confirm(`确定删除${data.username}吗？删除后对方就无法再访问本团队`, '确定删除该成员？', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    customClass: 'deleteMemberDialog',
    confirmButtonClass: 'deleteButton',
    cancelButtonClass: 'cancelButton',
    appendTo: '.Member_wrap',
    showClose: false,
    type: 'warning'
  })
    .then(() => {
      deleteTeamMember(data.id)
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

const deleteTeamMember = async (id) => {
  let res = await deleteTeamMemberApi(id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    getTeamMember()
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamMember = async () => {
  const params = {
    group: String(route.query.gid)
  }
  let res = await getTeamMemberApi(params)
  if (res.code === 1000) {
    memberList.value = res.data || ([] as any)
    memberTotal.value = memberList.value.length
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getTeamMember()
})
</script>

<template>
  <div class="Member_wrap">
    <TeamHeader />
    <div class="member-box">
      <div class="header">
        <h2>
          成员
          <span class="counts">{{ memberTotal }}</span>
          <el-tooltip effect="dark" content="绑定部门后，部门成员访问该团队时将自动成为团队成员，未访问过的成员不生效。" placement="top">
            <span class="departMemberIcon">
              <img src="/src/assets/icons/departMemberIcon.svg" alt="" />
              一键绑定空间成员
            </span>
          </el-tooltip>
        </h2>
        <div>
          <el-input v-model="memberInput" placeholder="搜索成员" clearable>
            <template #prefix>
              <i-ep-Search />
            </template>
          </el-input>
          <el-button @click="isShowAddMemberDialog = true"> 添加成员 </el-button>
        </div>
      </div>
      <div class="member">
        <vxe-table
          :data="memberList"
          border="inner"
          ref="xTable"
          max-height="800"
          :row-config="{ isHover: true }"
          @checkbox-all="selectAllChangeEvent"
          @checkbox-change="selectChangeEvent"
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column field="username" title="姓名" width="451" sortable></vxe-column>
          <vxe-column field="role" title="角色" :formatter="formatterRole" width="200" sortable></vxe-column>
          <vxe-column field="status" width="200" title="账号状态" :formatter="formatterStatus" sortable></vxe-column>
          <vxe-column field="update_datetime" width="250" title="加入时间" sortable></vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }">
              <el-tooltip effect="dark" content="退出" placement="top" :show-arrow="false">
                <span class="icon" v-if="row.role === '0'">
                  <img src="/src/assets/icons/team/editIcon.svg" alt="" @click="toExit(row)" />
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :show-arrow="false">
                <span class="icon" v-if="row.role === '2' || row.role === '1'">
                  <img src="/src/assets/icons/organize/deleteIcon.svg" alt="" @click="toDeleteMmber(row)" />
                </span>
              </el-tooltip>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
  <addMemberDialog :isShow="isShowAddMemberDialog" @closeDialog="isShowAddMemberDialog = false" :selectMember="memberList" />
</template>

<style lang="scss" scoped>
.Member_wrap {
  margin: -26px -36px !important;
  padding: 0 36px;
  width: 100%;
  .member-box {
    margin-top: 24px;
    padding-left: 36px;
    padding-right: 36px;
    max-width: 1664px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
      h2 {
        font-size: 16px;
        color: #262626;
        display: flex;
        align-items: center;
        .counts {
          margin-left: 12px;
          margin-top: 2px;
          padding: 0 8px;
          background-color: #eff0f0;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 500;
          color: #585a5a;
          line-height: 20px;
          box-sizing: border-box;
        }
        .departMemberIcon {
          color: #585a5a;
          margin-left: 30px;
          font-size: 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            width: 16px;
            min-width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }
      div {
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
          background-color: #00b96b;
          color: #fff;
          border: none;
          &:hover {
            color: #fff;
            border-color: #009456;
            background-color: #009456;
          }
        }
      }
    }
    .member {
      .icon {
        width: 22px;
        height: 22px;
        cursor: pointer;
      }
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

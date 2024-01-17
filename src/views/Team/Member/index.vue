<script lang="ts" setup>
import { deleteTeamMemberApi, editTeamMemberApi, getTeamMemberApi } from '@/api/member'
import { VxeTableInstance, VxeColumnPropTypes } from 'vxe-table'
import departMemberIcon from '@/assets/icons/departMemberIcon.svg'
import img from '@/assets/img/img.jpg'
import editIcon from '@/assets/icons/team/editIcon.svg'
import deleteIcon from '@/assets/icons/organize/deleteIcon.svg'

interface MemberItem {
  id: number
  avatar: string
  name: string
  role: string
  group: number
  dept: string
  update_datetime: string
}

const route = useRoute()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const nickname = JSON.parse(localStorage.getItem('userInfo')).nickname || ''
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const memberInput = ref('')
const xTable = ref<VxeTableInstance<MemberItem>>()
const memberList = ref<MemberItem[]>([])
const memberTotal = ref(0)
const isShowAddMemberDialog = ref(false)
const loadTable = ref(false)
const teamInfo = ref({
  icon: ''
})
const sexList = [
  { label: '管理员', value: '0', desc: '拥有所有权限' },
  { label: '只读成员', value: '1', desc: '拥有知识库管理权限' },
  { label: '成员', value: '2', desc: '仅有阅读权限' }
]
const statusList = [
  { label: '正常', value: '1' },
  { label: '注销', value: '0' }
]

const init = () => {
  const { icon } = infoStore.currentTeamInfo
  teamInfo.value.icon = icon
}

watchEffect(() => {
  if (refreshStore.isRefreshTeamMember) {
    getTeamMember()
    refreshStore.isRefreshTeamMember = false
  }
  if (route.path.includes('/team')) {
    init()
  }
})

const toDo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const formatterRole: VxeColumnPropTypes.Formatter<MemberItem> = ({ cellValue }) => {
  const item = sexList.find((item) => item.value === cellValue)
  return item ? item.label : cellValue
}

const formatterStatus: VxeColumnPropTypes.Formatter<MemberItem> = ({ cellValue }) => {
  const item = statusList.find((item) => item.value === cellValue)
  return item ? item.label : cellValue
}

const toDeleteMmber = (type, data) => {
  if (type === 'exit') {
    ElMessageBox.confirm(`确定退出吗？退出后就无法再访问本团队`, '确定退出该团队？', {
      confirmButtonText: '确定',
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
        ElMessage.info('取消操作')
      })
  } else {
    ElMessageBox.confirm(`确定删除${data.name}吗？删除后对方就无法再访问本团队`, '确定删除该成员？', {
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
}

const toChangeRole = (data, row) => {
  console.log(`output->data`, row)
  const params = {
    role: data.value,
    space: infoStore.currentQuery?.sid,
    group: infoStore.currentQuery?.gid,
    username: row.username
  }
  editTeamMember(row.id, params)
}

const toExit = (data) => {
  console.log(`output->data`, data)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const editTeamMember = async (id, params) => {
  let res = await editTeamMemberApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('编辑成功')
    getTeamMember()
  } else {
    ElMessage.error(res.msg)
  }
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
    group: infoStore.currentQuery?.gid
  }
  loadTable.value = true
  let res = await getTeamMemberApi(params)
  loadTable.value = false
  if (res.code === 1000) {
    memberList.value = res.data || ([] as any)
    memberTotal.value = memberList.value.length + 1
    const { id, avatar, creator_name, dept, create_datetime } = infoStore.currentTeamInfo
    memberList.value.unshift({
      id,
      avatar,
      name: creator_name,
      role: '0',
      group: id,
      dept,
      update_datetime: create_datetime
    })
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
    <TeamHeader :icon="teamInfo.icon" />
    <div class="member-box">
      <div class="header">
        <h2>
          成员
          <span class="counts">{{ memberTotal }}</span>
          <el-tooltip effect="dark" content="绑定部门后，部门成员访问该团队时将自动成为团队成员，未访问过的成员不生效。" placement="top">
            <span class="departMemberIcon" @click="toDo">
              <img :src="departMemberIcon" alt="" />
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
          max-height="750"
          min-height="50"
          :row-config="{ isHover: true }"
          @checkbox-all="selectAllChangeEvent"
          @checkbox-change="selectChangeEvent"
          v-loading="loadTable"
          element-loading-text="加载成员中..."
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column title="姓名" width="451" sortable>
            <template #default="{ row }">
              <div class="cell">
                <img :src="row.avatar || img" alt="" />
                <span>{{ row.name }}</span>
                <span v-if="nickname === row.name" class="my_tag">你自己</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="role" title="角色" :formatter="formatterRole" width="200" sortable>
            <template #default="{ row, rowIndex }">
              <DropdownPopver :menuItems="sexList" :selectId="sexList[row.role].value" @toChange="toChangeRole($event, row)">
                <span class="el-dropdown" v-if="rowIndex !== 0 && row.username !== user">
                  {{ sexList[row.role].label }}
                  <i-ep-ArrowDown />
                </span>
              </DropdownPopver>
              <span v-if="rowIndex === 0 || row.username === user">{{ sexList[row.role].label }}</span>
            </template>
          </vxe-column>
          <vxe-column field="dept" width="200" title="所属部门" :formatter="formatterStatus" sortable></vxe-column>
          <vxe-column field="update_datetime" width="250" title="加入时间" sortable></vxe-column>
          <vxe-column title="操作">
            <template #default="{ row, rowIndex }">
              <el-tooltip effect="dark" content="退出" placement="top" :show-arrow="false">
                <span class="icon" v-if="rowIndex === 0 && row.username === user">
                  <img :src="editIcon" alt="" @click="toExit(row)" />
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="退出" placement="top" :show-arrow="false">
                <span class="icon" v-if="rowIndex !== 0 && row.username === user">
                  <img :src="editIcon" alt="" @click="toDeleteMmber('exit', row)" />
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :show-arrow="false">
                <span class="icon" v-if="rowIndex !== 0 && row.username !== user">
                  <img :src="deleteIcon" alt="" @click="toDeleteMmber('delete', row)" />
                </span>
              </el-tooltip>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
  <AddMemberDialog :isShow="isShowAddMemberDialog" @closeDialog="isShowAddMemberDialog = false" :selectMember="memberList" :isOnlyMember="false" />
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
      .cell {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          margin-right: 12px;
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
      .el-dropdown {
        display: flex;
        align-items: center;
        cursor: pointer;
        svg {
          margin-left: 6px;
          width: 14px;
          height: 14px;
        }
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

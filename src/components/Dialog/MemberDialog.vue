<script lang="ts" setup>
import memberIcon from '@/assets/icons/user/memberIcon.svg'
import { addSpacepermissionsApi } from '@/api/spacepermissions'
import { getDepartmentsApi, getDepartUserApi } from '@/api/user'
import { ElTable } from 'element-plus'

interface DeptList {
  id: string
  name: string
  parent: string
  username: string
  children?: DeptList[]
}

const props = defineProps({
  isShow: Boolean,
  spaceMember: Array as any
})

const emit = defineEmits(['closeDialog'])

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const avatarUrl = import.meta.env.VITE_BASE_LOGIN_URL
const dialogVisible = ref(false)
const loadTable = ref(false)
const defaultProps = {
  children: 'children',
  label: 'name'
}
const memberTableRef = ref<InstanceType<typeof ElTable>>()
const deptList = ref([]) // 部门列表
const deptId = ref('') // 当前部门id
const deptName = ref('') // 当前部门名称
const memberList = ref([]) // 成员列表
const memberTotal = ref(0) // 成员总数
const selectMemberList = ref<DeptList[]>([]) // 已选择成员

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (dialogVisible.value) {
      await getDepartments()
      await getDepartUser(deptId.value)
    }
  }
)

const handleSubmit = async () => {
  try {
    addSpacepermissions()
  } catch (error) {
    // error
  }
}

const handleClose = async () => {
  memberTableRef.value!.clearSelection()
  dialogVisible.value = false
  emit('closeDialog', false)
}

const toChangeDeptId = (data: DeptList) => {
  if (data.id === deptId.value) return
  deptId.value = data.id
  deptName.value = data.name
  getDepartUser(deptId.value)
}

const handleSelectionChange = (val) => {
  selectMemberList.value = val
  console.log(`output->selectMemberList.value`, selectMemberList.value)
}

// 添加空间成员
const addSpacepermissions = async () => {
  const params = {
    permusername: [],
    space: infoStore.currentQuery?.sid,
    permtype: '1'
  }
  selectMemberList.value.forEach((item) => {
    params.permusername.push(item.username)
  })
  let res = await addSpacepermissionsApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    handleClose()
    refreshStroe.setRefreshSpaceMember(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const getDepartUser = async (id: string) => {
  const params = {
    dept_id: id
  }
  loadTable.value = true
  let res = await getDepartUserApi(params)
  loadTable.value = false
  if (res.code === 1000) {
    if (props.spaceMember.length) {
      memberList.value = res.data.filter((item) => {
        return !props.spaceMember.some((v) => v.permusername === item.username)
      })
      memberList.value = memberList.value.filter((item) => {
        return item.username !== user
      })
    }
    memberTotal.value = memberList.value.length
  } else {
    ElMessage.error(res.msg)
  }
}

const getDepartments = async () => {
  loadTable.value = true
  let res = await getDepartmentsApi()
  if (res.code === 1000) {
    deptList.value = arrayToTree(res.data, null)
    deptId.value = deptList.value[0].id
    deptName.value = deptList.value[0].name
  } else {
    ElMessage.error(res.msg)
  }
}

const arrayToTree = (list: DeptList[], id: string) => {
  const result = []
  list.forEach((item) => {
    if (item.parent === id) {
      const children = arrayToTree(list, item.id)
      if (children.length > 0) {
        item.children = children
      }
      result.push(item)
    }
  })
  return result
}
</script>

<template>
  <el-dialog class="memberDialog" v-model="dialogVisible" title="添加成员" width="900" :before-close="handleClose">
    <p>仅展示非【{{ infoStore.currentQuery?.sname }}】空间的公司所有成员</p>
    <div class="container">
      <div class="container-left">
        <el-tree :data="deptList" :props="defaultProps" node-key="id" highlight-current :current-node-key="deptId" @node-click="toChangeDeptId" />
      </div>
      <div class="container-right">
        <div class="header">
          <span>{{ deptName }}</span>
          <el-tooltip effect="dark" content="仅包含该部门中不在本空间下的成员数" placement="top">
            <span class="memberIcon"><img :src="memberIcon" alt="" />{{ loadTable ? '加载中...' : memberTotal }} </span>
          </el-tooltip>
        </div>
        <div class="member-list">
          <!-- <div class="operation" v-if="selectMemberList.length">
            <div style="display: flex; align-items: center">
              已选择 {{ selectMemberList.length }} 位成员
              <el-button link type="danger">取消选择</el-button>
            </div>
          </div> -->
          <el-table
            ref="memberTableRef"
            :data="memberList"
            style="width: 100%"
            row-key="user_id"
            @selection-change="handleSelectionChange"
            empty-text="该部门下暂无可添加成员"
            height="500"
            max-height="500"
            v-loading="loadTable"
            element-loading-text="加载成员中..."
          >
            <el-table-column type="selection" width="55" :reserve-selection="true" />
            <el-table-column property="name" label="姓名" width="120">
              <template #default="{ row }">
                <img class="avatar" :src="avatarUrl + row.avatar" />
                <label>{{ row.name }}</label>
              </template>
            </el-table-column>
            <el-table-column property="is_active" label="账号状态" width="120">
              <template #default="{ row }">
                <el-tag v-if="row.is_active === 1" type="success">正常</el-tag>
                <el-tag v-else type="danger">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column property="post_name" label="岗位" width="130" />
            <el-table-column property="mobile" label="手机号" width="120" />
          </el-table>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="member-footer">
        <el-button type="danger" @click="handleClose"> 算了 </el-button>
        <el-button :class="['submit', selectMemberList.length ? '' : 'submit-disabled']" type="primary" @click="handleSubmit" :disabled="!selectMemberList.length">
          添加（{{ selectMemberList.length }}）
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  min-height: 400px;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  &-left {
    border-right: 1px solid #e7e9e8;
    width: 256px;
    padding-top: 16px;
    overflow-x: hidden;
    box-sizing: border-box;
    max-height: 560px;
  }
  &-right {
    padding: 16px 0;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    .header {
      width: auto;
      margin: 0 24px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      span {
        font-size: 16px;
        color: #262626;
        font-weight: 700;
      }
      .memberIcon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        margin-right: 16px;
        img {
          width: 16px;
          min-width: 16px;
          height: 16px;
        }
      }
    }
    .member-list {
      margin: 0 24px;
      .operation {
        color: rgba(0, 0, 0, 0.45);
        font-weight: 400;
        font-size: 14px;
        margin-left: 8px;
        margin-bottom: 12px;
        .el-button {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.memberDialog {
  border-radius: 8px;
  p {
    margin-top: -20px;
    margin-bottom: 28px;
    color: #8a8f8d;
    font-size: 14px;
  }
  .el-table {
    .cell {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    .avatar {
      width: 24px;
      height: 24px;
      margin-right: 6px;
      border-radius: 12px;
    }
  }
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 40px;
    border-radius: 6px;
  }
  .member-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    .el-button {
      margin: 0 20px;
      width: 100px;
      height: 40px;
      border: none;
      border-radius: 6px;
    }
    .submit {
      width: 100px;
      height: 40px;
      color: #fff;
      background-color: #00b968;
      border: none;
      border-radius: 6px;
      &:hover {
        cursor: pointer;
        background-color: #009456;
      }
    }
    .submit-disabled {
      cursor: not-allowed !important;
      background-color: #b2eab2 !important;
    }
  }
}
</style>

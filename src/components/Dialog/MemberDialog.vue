<script lang="ts" setup>
import memberIcon from '@/assets/icons/user/memberIcon.svg'
import { addSpacepermissionsApi } from '@/api/spacepermissions'
import { getDepartmentsApi, getDepartUserApi, getUserApi } from '@/api/user'
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
const user = JSON.parse(localStorage.getItem('xinAn-userInfo')).username || ''
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
const searchName = ref([]) // 搜索成员
const searchList = ref([]) // 搜索成员列表
const searchloading = ref(false) // 搜索成员loading
const selectName = ref([]) // 搜索成员名称

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (dialogVisible.value) {
      searchName.value = []
      await getDepartments()
      await getDepartUser(deptId.value)
    }
  }
)

watch(
  () => searchName.value,
  (newVal) => {
    if (!newVal.length) {
      selectName.value = []
    }
  }
)

const handleSubmit = async () => {
  try {
    addSpacepermissions('all')
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
}

// 添加空间成员
const addSpacepermissions = async (type) => {
  const params = {
    permusername: [],
    space: infoStore.currentQuery?.sid,
    permtype: '1'
  }
  type === 'all' &&
    selectMemberList.value.forEach((item) => {
      params.permusername.push(item.username)
    })
  type === 'some' && (params.permusername = searchName.value)
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

const toSearch = async (query: string) => {
  if (query) {
    const params = {
      name: query,
      page: 1,
      pagesize: 10000
    }
    searchloading.value = true
    let res = await getUserApi(params)
    searchloading.value = false
    if (res.code === 1000) {
      searchList.value = res.data
    } else {
      ElMessage.error(res.msg)
    }
  } else {
    searchList.value = []
  }
}

const toAddMember = (val) => {
  let arr = []
  val.forEach((item) => {
    searchList.value.forEach((v) => {
      if (item === v.username) {
        arr.push({ name: v.name, username: v.username })
      }
    })
  })
  arr.forEach((item) => {
    selectName.value.push(item)
  })
  selectName.value = selectName.value.filter((item, index) => selectName.value.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item)) === index)
}

const toRemoveMember = (val) => {
  selectName.value = selectName.value.filter((v) => v.username !== val)
}
</script>

<template>
  <el-dialog class="memberDialog" v-model="dialogVisible" title="添加成员" width="900" :before-close="handleClose">
    <div flex items-center justify-between mt="-20px" mb-28px>
      <p>仅展示<bold text-color="#f56c6c">非</bold>【{{ infoStore.currentQuery?.sname }}】空间的公司所有成员</p>
      <el-select
        v-model="searchName"
        multiple
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="搜索成员名称"
        loading-text="搜索中..."
        no-match-text="搜索内容为空"
        no-data-text="无数据"
        :remote-method="toSearch"
        :loading="searchloading"
        :max-collapse-tags="4"
        style="min-width: 240px; max-width: 20vw"
        @change="toAddMember"
        @remove-tag="toRemoveMember"
      >
        <el-option v-for="item in searchList" :key="item.id" :label="item.name" :value="item.username">
          <div flex items-center>
            <img :src="'http://10.4.150.56:8032/' + item.avatar" w-24px h-24px mr-4px />
            <span>{{ item.name }}</span>
            <span>
              （<span>{{ item.post_name }}）</span>
            </span>
            <span mr-10px ml-10px>-</span>
            <span>{{ item.dept_name }}</span>
          </div>
        </el-option>
        <template #footer>
          <el-tag v-for="(item, index) in selectName" :key="'searchName' + index">{{ item.name }}</el-tag>
          <el-button style="float: right; background-color: '#00b968'" size="small" class="submit2" border-none color="#fff" @click="addSpacepermissions('some')">
            添加所选成员
          </el-button>
        </template>
      </el-select>
    </div>
    <div class="container">
      <div class="container-left">
        <el-tree
          :data="deptList"
          :props="defaultProps"
          node-key="id"
          highlight-current
          :current-node-key="deptId"
          :expand-on-click-node="false"
          accordion
          @node-click="toChangeDeptId"
          v-loading="loadTable"
          element-loading-text="请稍等..."
        />
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
.submit2 {
  border: none !important;
  background-color: #00b968 !important;
  color: #fff !important;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer !important;
    background-color: #009456 !important;
  }
}
.memberDialog {
  border-radius: 8px;
  p {
    color: #8a8f8d;
    font-size: 14px;
  }
  .is-focus,
  .is-focused {
    border-color: #0bd07d !important;
  }
  .el-select__input {
    margin-left: 0px;
  }
  .el-input__wrapper,
  .el-select__wrapper {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    &:hover {
      border-color: #0bd07d;
    }
  }
  .el-dialog__header {
    border-bottom: none;
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

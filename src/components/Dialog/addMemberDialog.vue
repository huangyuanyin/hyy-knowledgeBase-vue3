<script lang="ts" setup>
import { addTeamMemberApi } from '@/api/member'
import { getSpacepermissionsApi } from '@/api/spacepermissions'
import { ElTable } from 'element-plus'

interface Member {
  permusername: string
}

const props = defineProps({
  isShow: Boolean,
  isAuto: {
    type: Boolean,
    default: true
  }, // 是否自动添加
  isOnlyMember: {
    type: Boolean,
    default: false
  }, // 是否只能添加为成员
  selectMember: Array // 已添加的成员
})
const emit = defineEmits(['closeDialog', 'submitMember'])

const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const avatar = 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo') || '{}').avatar
const selectTotal = ref(0)
const dialogVisible = ref(false)
const loadTable = ref(false)
const spaceName = ref('')
const role = ref('2') // 2：成员；1：只读成员
const memberListRef = ref<InstanceType<typeof ElTable>>()
const selectMemberList = ref<Member[]>([])
const memberList = ref<Member[]>([])

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (dialogVisible.value) {
      memberList.value = []
      spaceName.value = infoStore.currentSpaceInfo?.spacename
      getSpacepermissions()
    }
  }
)

const handleSelectionChange = (val: Member[]) => {
  selectMemberList.value = val
  selectTotal.value = val.length
}

const handleClose = async () => {
  selectMemberList.value = []
  dialogVisible.value = false
  emit('closeDialog', false)
}

const toChangeRole = (command: string) => {
  role.value = command
}

const toAddMember = () => {
  if (props.isAuto) {
    addTeamMember()
  } else {
    emit('submitMember', selectMemberList.value)
    handleClose()
    console.log(`output->已选择`, selectMemberList.value)
  }
}

const addTeamMember = async () => {
  const params = {
    username: [],
    group: infoStore.currentQuery?.gid,
    space: infoStore.currentQuery?.sid,
    role: role.value //2：成员；1：只读成员
  }
  selectMemberList.value.forEach((item) => {
    params.username.push(item.permusername)
  })
  let res = await addTeamMemberApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    handleClose()
    refreshStore.setRefreshTeamMember(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpacepermissions = async () => {
  const params = {
    space: infoStore.currentQuery.sid
  }
  loadTable.value = true
  const res = await getSpacepermissionsApi(params)
  loadTable.value = false
  if (res.code === 1000) {
    memberList.value = res.data.filter((item) => {
      return !props.selectMember.some((item2: any) => {
        console.log(`output->prtop`, props.selectMember)
        return item2.username === item.permusername
      })
    })
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <el-dialog class="addMemberDialog" v-model="dialogVisible" title="从空间添加成员" width="360" :before-close="handleClose">
    <div class="header">{{ spaceName }}</div>
    <el-table
      ref="memberListRef"
      :data="memberList"
      @selection-change="handleSelectionChange"
      min-height="100"
      max-height="55vh"
      empty-text="该空间下暂无可添加成员"
      v-loading="loadTable"
      element-loading-text="加载成员中..."
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="permusername" label="全选">
        <template #default="{ row }">
          <div class="cell">
            <img :src="row.avatar || avatar" alt="" />
            <span class="name">{{ row.permname }}</span>
            <span class="nick">（{{ row.permusername }}）</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="footer">
        <div class="left">
          <span class="count">已选择 {{ selectTotal }}人</span>
          <span>
            添加为：
            <span v-if="props.isOnlyMember">成员</span>
            <el-dropdown trigger="click" @command="toChangeRole" v-if="!props.isOnlyMember">
              <span class="el-dropdown-link" v-if="!props.isOnlyMember">
                {{ role === '1' ? '只读成员' : '成员' }}
                <i-ep-ArrowDown />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="2">成员</el-dropdown-item>
                  <el-dropdown-item command="1">只读成员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </div>
        <el-button type="success" @click="toAddMember"> 添加 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

<style lang="scss">
.addMemberDialog {
  .header {
    margin-bottom: 16px;
    padding: 0px 14px;
    color: #000000;
  }
  .el-dialog__body {
    padding-top: 16px;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      border-radius: 24px;
    }
    .name {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 8px !important;
      max-width: 120px;
      color: #262626;
    }
    .nick {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 150px;
      font-size: 12px;
      color: #8a8f8d;
    }
  }
  .el-table__empty-block {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer {
    padding: 0px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      color: #8a8f8d;
      font-size: 14px;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
      }
      .count {
        margin-right: 16px;
      }
      .el-dropdown-link {
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

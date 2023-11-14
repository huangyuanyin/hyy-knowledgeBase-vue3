<template>
  <el-dialog class="addBookMemberDialog" v-model="dialogVisible" title="从团队添加成员" width="360" :before-close="handleClose">
    <div class="header">{{ teamName }}</div>
    <el-table ref="memberListRef" :data="memberList" @selection-change="handleSelectionChange" min-height="100" max-height="800" empty-text="该团队下暂无可添加成员">
      <el-table-column type="selection" width="45" />
      <el-table-column property="username" label="全选">
        <template #default="{ row }">
          <div class="cell">
            <img :src="row.avatar || '/src/assets/img/img.jpg'" alt="" />
            <span class="name">{{ row.name }}</span>
            <span class="nick">（{{ row.username }}）</span>
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
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                成员
                <i-ep-ArrowDown />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>成员</el-dropdown-item>
                  <el-dropdown-item disabled>只读成员</el-dropdown-item>
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

<script lang="ts" setup>
import { addCollaborationsApi } from '@/api/collaborations'
import { getTeamMemberApi } from '@/api/member'
import { ElTable } from 'element-plus'

interface Member {
  username: string
}

const props = defineProps({
  isShow: Boolean,
  selectMember: Array // 已添加的成员
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const refreshStore = useRefreshStore()
const selectTotal = ref(0)
const dialogVisible = ref(false)
const teamName = ref('')
const memberListRef = ref<InstanceType<typeof ElTable>>()
const selectMemberList = ref<Member[]>([])
const memberList = ref<Member[]>([])

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (dialogVisible.value) {
      teamName.value = route.query.gname as string
      getTeamMember()
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

const toAddMember = () => {
  addBookMember()
}

const addBookMember = async () => {
  const params = {
    permusername: [],
    permtype: '1',
    book: route.query.lid as string
  }
  selectMemberList.value.forEach((item) => {
    params.permusername.push(item.username)
  })
  let res = await addCollaborationsApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    handleClose()
    refreshStore.setRefreshTeamMember(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamMember = async () => {
  const params = {
    group: route.query.gid as string
  }
  const res = await getTeamMemberApi(params)
  if (res.code === 1000) {
    memberList.value = res.data.filter((item) => {
      return !props.selectMember.some((item2: any) => {
        return item2.username === item.permusername
      })
    })
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.addBookMemberDialog {
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
      max-width: 100px;
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
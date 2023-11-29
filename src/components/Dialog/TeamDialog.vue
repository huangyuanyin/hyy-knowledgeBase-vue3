<script lang="ts" setup>
import imgIcon from '@/assets/img/img.jpg'
import { v4 as uuidv4 } from 'uuid'
import { FormInstance } from 'element-plus'
import { addGroupsApi } from '@/api/groups'
import { getSpacepermissionsApi } from '@/api/spacepermissions'
import { icon11 } from '@/data/iconBase64'

interface ListItem {
  permusername: string
  permname: string
  dept: string
}

const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog', 'updateTeam'])

const route = useRoute()
const refreshStore = useRefreshStore()
const dialogVisible = ref(false)
const loadingMember = ref(false)
const isShowAddMemberDialog = ref(false)
const options = ref<ListItem[]>([])
const list = ref([])
const selectMemberList = ref([])
const teamFormRef = ref<FormInstance>()
const teamForm = reactive({
  icon: icon11,
  groupname: '',
  groupkey: '',
  space: String(route.query.sid),
  members: [],
  description: ''
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    getSpacepermissions()
  }
)

const remoteMethod = (query: string) => {
  if (query) {
    loadingMember.value = true
    setTimeout(() => {
      loadingMember.value = false
      options.value = list.value.filter((item) => {
        return item.permusername.toLowerCase().includes(query.toLowerCase()) || item.permname.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
    console.log(`output->options.value`, options.value, list.value)
  } else {
    options.value = []
  }
}

const toAddBatches = () => {
  isShowAddMemberDialog.value = true
  selectMemberList.value = teamForm.members
}

const submitMember = (data: any) => {
  options.value = list.value
  data.forEach((item) => {
    teamForm.members.push(item.permusername)
  })
  teamForm.members = Array.from(new Set(teamForm.members))
}

const handleSubmit = async () => {
  try {
    await teamFormRef.value.validate()
    addGroups()
  } catch (error) {
    // error
  }
}

// 新增团队
const addGroups = async () => {
  teamForm.groupkey = uuidv4().replace(/-/g, '')
  let res = await addGroupsApi(teamForm)
  if (res.code === 1000) {
    handleClose()
    if (route.path.includes('teamManage')) {
      emit('updateTeam')
      return
    }
    ElMessage.success('团队创建成功，即将跳转...')
    refreshStore.setRefreshQuickTeamList(true)
    setTimeout(() => {
      router.push({
        path: `/${route.path.split('/')[1]}/team/book`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: res.data.id,
          gname: res.data.groupname
        }
      })
    }, 1000)
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpacepermissions = async () => {
  const params = {
    space: route.query.sid as string
  }
  const res = await getSpacepermissionsApi(params)
  if (res.code === 1000) {
    list.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = async () => {
  resetForm(teamFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}

const changeIcon = (icon: string) => {
  teamForm.icon = icon
}
</script>

<template>
  <el-dialog class="teamDialog" v-model="dialogVisible" title="新建团队" width="424" :before-close="handleClose">
    <p>和成员一起进行项目协作和知识管理</p>
    <el-form ref="teamFormRef" :model="teamForm" label-width="120px" label-position="top">
      <el-form-item label="基本信息" prop="groupname">
        <div class="form-name">
          <SelectIconPopver @changeIcon="changeIcon">
            <div class="bookIcon">
              <img :src="teamForm.icon" alt="" />
            </div>
          </SelectIconPopver>
          <el-input v-model="teamForm.groupname" placeholder="团队名称" maxlength="64" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item label="" class="form-description" prop="description">
        <el-input v-model="teamForm.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="团队简介" />
      </el-form-item>
      <el-form-item class="form-member">
        <template #label>
          <div class="label">
            <span>添加成员</span>
            <el-button link type="primary" @click="toAddBatches">+ 批量添加</el-button>
          </div>
        </template>
        <el-select
          v-model="teamForm.members"
          multiple
          filterable
          clearable
          remote
          reserve-keyword
          collapse-tags
          collapse-tags-tooltip
          placeholder="输入空间成员名字搜索添加"
          :remote-method="remoteMethod"
          :loading="loadingMember"
          :teleported="false"
          :max-collapse-tags="3"
        >
          <el-option v-for="(item, index) in options" :key="'options' + index" :label="item.permname" :value="item.permusername">
            <div class="item">
              <span class="img">
                <img :src="imgIcon" alt="" />
              </span>
              <div class="info">
                <span class="label">
                  {{ item.permname }}
                  <span class="nickname">({{ item.permusername }})</span>
                </span>
                <span class="value">{{ item.dept }}</span>
              </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', teamForm.groupname ? '' : 'submit-disabled']" type="primary" @click="handleSubmit" :disabled="!teamForm.groupname"> 新建 </el-button>
      </span>
    </template>
  </el-dialog>
  <AddMemberDialog
    :isShow="isShowAddMemberDialog"
    @closeDialog="isShowAddMemberDialog = false"
    @submitMember="submitMember"
    :selectMember="selectMemberList"
    :is-auto="false"
    :isOnlyMember="true"
  />
</template>

<style lang="scss" scoped>
.form-public {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .selectIcon {
    width: 14px;
    height: 14px;
    margin-left: 8px;
  }
  &-left {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 24px;
      margin-right: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
:deep(.el-select-dropdown__item) {
  height: 62px;
}
.item {
  height: 100%;
  margin-bottom: 4px;
  border-radius: 6px;
  color: #262626;
  padding: 0 8px;
  display: flex;
  align-items: center;
  img {
    width: 32px;
    min-width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span {
      display: flex;
      align-items: center;
    }
    .label {
      color: #262626;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
    }
    .nickname,
    .value {
      color: #8a8f8d;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
    }
    .nickname {
      margin-left: 6px;
    }
  }
}
</style>

<style lang="scss">
.teamDialog {
  border-radius: 8px;
  p {
    margin-top: -20px;
    margin-bottom: 28px;
    color: #8a8f8d;
    font-size: 14px;
  }
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .el-form-item {
    margin-bottom: 12px;
    border-radius: 6px;
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 40px;
    border-radius: 6px;
  }
  .form-description {
    margin-bottom: 24px;
  }
  .form-member {
    margin-bottom: 24px;
    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-form-item__label {
      padding-right: 0px;
    }
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
    .bookIcon {
      border-radius: 4px;
      padding: 6px;
      width: 40px;
      height: 40px;
      border: 1px solid #d8dad9;
      margin-right: 6px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .prefix-icon {
    width: 24px;
    height: 24px;
    border-radius: 24px;
  }
  .library-footer {
    .submit {
      width: 100%;
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

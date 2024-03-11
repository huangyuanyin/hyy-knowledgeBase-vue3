<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { editGroupsApi } from '@/api/groups/index'

interface TeamForm {
  space: string
  groupname: string
  groupkey: string
  description: string
  icon: string
}

const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const groupId = ref<number>(null)
const teamFormRef = ref<FormInstance>()
const teamForm = reactive<TeamForm>({
  space: infoStore.currentQuery.sid,
  groupname: '',
  groupkey: '',
  description: '',
  icon: ''
})
const rules = reactive<FormRules<TeamForm>>({
  groupname: [
    { required: true, message: '请输入团队名称，长度在 2-50 之间', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入团队名称，长度在 2-50 之间', trigger: 'blur' }
  ]
})

watchEffect(() => {
  if (infoStore.currentTeamInfo.id !== infoStore.currentQuery.gid) initData()
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(teamForm))
      editGroups(params, groupId.value)
    }
  })
}

const editGroups = async (params, id) => {
  let res = await editGroupsApi(params, id)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    router.push({
      path: `/${route.path.split('/')[1]}/teamSetting/basic`,
      query: {
        sname: infoStore.currentQuery?.sname,
        sid: res.data.space,
        gname: res.data.groupname,
        gid: infoStore.currentQuery?.gid
      }
    })
    infoStore.setCurrentTeamInfo(res.data)
    refreshStore.setRefreshTeamSet(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const changeIcon = (icon: string) => {
  teamForm.icon = icon
}

function initData() {
  groupId.value = Number(infoStore.currentQuery?.gid)
  const { groupname, groupkey, description, icon } = infoStore.currentTeamInfo
  teamForm.groupname = groupname
  teamForm.groupkey = groupkey
  teamForm.description = description
  teamForm.icon = icon
}
</script>

<template>
  <div class="Basic_wrap">
    <div class="header">团队信息</div>
    <div class="box">
      <el-form ref="teamFormRef" :model="teamForm" :rules="rules" label-width="120px" class="teamForm" status-icon label-position="top">
        <el-form-item label="团队头像">
          <SelectIconPopver @changeIcon="changeIcon">
            <div class="icon-tag">
              <img :src="teamForm.icon" alt="" />
            </div>
          </SelectIconPopver>
        </el-form-item>
        <el-form-item label="团队名称" prop="groupname">
          <el-input v-model="teamForm.groupname" placeholder="如：就叫小黄好了" />
        </el-form-item>
        <el-form-item label="团队简介">
          <el-input v-model="teamForm.description" type="textarea" rows="7" placeholder="如：让天下没有难做的生意" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm(teamFormRef)"> 更新信息 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Basic_wrap {
  margin: auto;
  max-width: 124vh;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  .box {
    max-width: 668px;
    .teamForm {
      :deep(.el-form-item__label) {
        line-height: 40px;
      }
      :deep(.el-input) {
        height: 40px;
        max-width: 448px;
        .is-focus {
          border-color: #0bd07d !important;
        }
      }
      :deep(.el-form-item.is-error .el-input__wrapper) {
        border-color: #f56c6c;
      }
      :deep(.el-input__wrapper),
      :deep(.el-textarea__inner) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
      :deep(.el-input-group) {
        .el-input__wrapper {
          border-radius: 0px !important;
        }
      }
      .icon-tag {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 56px;
          height: 56px;
          margin-right: 16px;
          border-radius: 6px;
        }
      }
      .submit {
        margin-top: 8px;
        color: #fff;
        background-color: #00b968;
        border: none;
        border-radius: 6px;
        &:hover {
          cursor: pointer;
          background-color: #009456;
        }
      }
      .upload {
        height: 59px;
        &-button {
          margin-top: 0px;
          color: #262626;
          border-radius: 6px;
          svg {
            margin-right: 5px;
          }
          &:hover {
            color: #009456;
            border-color: #009456;
            background-color: #fff;
          }
        }
        &-tip {
          margin-top: 0px;
          font-size: 12px;
          color: #8a8f8d;
        }
      }
    }
  }
}
</style>

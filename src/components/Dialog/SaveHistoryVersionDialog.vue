<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { addArticleVersionApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean,
  info: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['closeDialog'])

const dialogVisible = ref(false)
const versionForm = reactive({
  name: '',
  body: '',
  content: '',
  type: ''
})
const saveHistoryVersionFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入版本名称', trigger: 'blur' }]
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      versionForm.body = props.info.body
      versionForm.content = props.info.id
      versionForm.type = props.info.type
    }
  }
)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addArticleVersion(versionForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const addArticleVersion = async (params) => {
  let res = await addArticleVersionApi(params)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success('保存版本成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const handleCancel = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  handleClose()
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = async () => {
  resetForm(saveHistoryVersionFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="SaveHistoryVersionDialog" v-model="dialogVisible" title="保存为版本" width="368" :before-close="handleClose">
    <el-form ref="saveHistoryVersionFormRef" :rules="rules" :model="versionForm" label-width="120px" label-position="top">
      <el-form-item label="版本名称" prop="name">
        <div class="form-name">
          <el-input v-model="versionForm.name" placeholder="最多40个字符" maxlength="40" show-word-limit />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['button', 'cancel']" type="" @click="handleCancel(saveHistoryVersionFormRef)"> 取消 </el-button>
        <el-button :class="['button', 'submit']" type="primary" @click="handleSubmit(saveHistoryVersionFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.SaveHistoryVersionDialog {
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
    margin-bottom: 24px;
    border-radius: 6px;
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 36px;
    border-radius: 6px;
  }
  .prefix-icon {
    width: 20px;
    height: 20px;
  }
  .form-description {
    margin-bottom: 18px;
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .library-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .button {
      width: 60px;
      height: 32px;
      border-radius: 6px;
      margin-left: 8px;
      cursor: pointer;
    }
    .cancel {
      &:hover {
        color: #009456;
        border-color: #009456;
        background-color: #fff;
      }
    }
    .submit {
      border: none;
      color: #fff;
      background-color: #00b968;
      &:hover {
        background-color: #009456;
      }
    }
  }
}
</style>

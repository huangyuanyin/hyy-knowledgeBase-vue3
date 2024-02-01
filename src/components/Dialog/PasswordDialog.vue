<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import CryptoJS from 'crypto-js'

const props = defineProps({
  isShow: Boolean
})
const emit = defineEmits(['closeDialog'])

const dialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  newPassword2: ''
})
const rules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/,
      message: '密码必须由数字和字母组合，且长度在6-16位之间',
      trigger: 'blur'
    }
  ],
  newPassword2: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
  }
)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        oldPassword: CryptoJS.SHA512(passwordForm.oldPassword).toString(CryptoJS.enc.Base64),
        newPassword: CryptoJS.SHA512(passwordForm.newPassword).toString(CryptoJS.enc.Base64),
        newPassword2: CryptoJS.SHA512(passwordForm.newPassword2).toString(CryptoJS.enc.Base64)
      }
      useUser().editPassword(params, () => {
        handleClose()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleCancel = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  resetForm(formEl)
  dialogVisible.value = false
  emit('closeDialog', false)
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = async () => {
  resetForm(passwordFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog
    class="passwordDialog"
    v-model="dialogVisible"
    title="更改密码"
    width="400"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <p>请输入新密码进行设置。</p>
    <el-form ref="passwordFormRef" :rules="rules" :model="passwordForm" label-width="120px" label-position="top">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" placeholder="输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" placeholder="输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="passwordForm.newPassword2" placeholder="请重新输入新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['button', 'cancel']" type="" @click="handleCancel(passwordFormRef)"> 取消 </el-button>
        <el-button :class="['button', 'submit']" type="primary" @click="handleSubmit(passwordFormRef)"> 更新密码 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.passwordDialog {
  border-radius: 8px;
  p {
    margin-top: -20px;
    margin-bottom: 28px;
    color: #8a8f8d;
    font-size: 14px;
  }
  .el-dialog__header {
    border-bottom: none;
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
  .el-input {
    width: 100%;
    height: 36px;
    border-radius: 6px;
  }
  .el-form-item.is-error .el-input__wrapper {
    border-color: #f56c6c;
  }
  .el-input__wrapper {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    &:hover {
      border-color: #0bd07d;
    }
  }
  .library-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .button {
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

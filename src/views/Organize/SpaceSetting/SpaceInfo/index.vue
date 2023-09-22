<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

interface SpaceForm {
  spacename: string
  spacekey: string
  icon: string
  desc: string
}

const spaceFormRef = ref<FormInstance>()
const spaceForm = reactive<SpaceForm>({
  spacename: '',
  spacekey: '',
  icon: '',
  desc: ''
})
const rules = reactive<FormRules<SpaceForm>>({
  spacename: [
    { required: true, message: '请输入空间名称，长度在 2-50 之间', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入空间名称，长度在 2-50 之间', trigger: 'blur' }
  ],
  spacekey: [
    { required: true, message: '请填写域名', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入4-20个数字或字母', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', spaceForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const toUploadImg = (uploadFile) => {
  if (uploadFile) {
    const reader = new FileReader()
    reader.onload = (event) => {
      spaceForm.icon = event.target?.result
    }
    reader.readAsDataURL(uploadFile['raw'])
  }
}
</script>

<template>
  <div class="SpaceInfo_wrap">
    <div class="header">空间信息</div>
    <div class="box">
      <el-form ref="spaceFormRef" :model="spaceForm" :rules="rules" label-width="120px" class="spaceForm" status-icon label-position="top">
        <el-form-item label="空间名称" prop="spacename">
          <el-input v-model="spaceForm.spacename" placeholder="如：就叫小黄好了" />
        </el-form-item>
        <el-form-item label="空间地址" prop="spacekey">
          <el-input v-model="spaceForm.spacekey" />
        </el-form-item>
        <el-form-item label="空间描述">
          <el-input v-model="spaceForm.desc" type="textarea" rows="7" placeholder="如：让天下没有难做的生意" />
        </el-form-item>
        <el-form-item label="空间标识">
          <div class="icon-tag">
            <img v-if="!spaceForm.icon" src="/src/assets/icons/spaceIcon.svg" alt="" />
            <img v-else :src="spaceForm.icon" alt="" />
            <el-upload v-model:file-list="spaceForm.icon" class="upload" action="" :auto-upload="false" :show-file-list="false" @change="toUploadImg">
              <el-button class="upload-button"><i-ep-Upload></i-ep-Upload>上传图标</el-button>
              <template #tip>
                <div class="upload-tip">支持文件格式：.png, .jpg...</div>
              </template>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm(spaceFormRef)"> 更新信息 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SpaceInfo_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    .spaceForm {
      :deep(.el-form-item__label) {
        line-height: 40px;
      }
      .el-input {
        height: 40px;
        max-width: 348px;
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
      .icon-tag {
        display: flex;
        align-items: center;
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

<script lang="ts" setup>
const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog'])

const formData = {
  name: ''
}

const { dialogVisible, dialogFormRef: groupFormRef, dialogForm: groupForm, handleClose, handleSubmit } = useFormDialog({ isShow: ref(props.isShow), emit, formData })

watch(
  () => props.isShow,
  (newVal: boolean) => {
    console.log(`output->newVal`, newVal)
    dialogVisible.value = newVal
  }
)
</script>

<template>
  <el-dialog class="GroupDialog" v-model="dialogVisible" title="新建分组" width="424" :before-close="handleClose">
    <el-form ref="groupFormRef" :model="groupForm" label-width="120px" label-position="top">
      <el-form-item label="分组名称" prop="name">
        <div class="form-name">
          <el-input v-model="groupForm.name" placeholder="" show-word-limit />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="group-footer">
        <el-button class="cancel" type="default" @click="handleClose"> 取消 </el-button>
        <el-button class="submit" type="primary" @click="handleSubmit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>

<style lang="scss">
.GroupDialog {
  border-radius: 8px;
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
    margin-bottom: 24px;
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
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .el-dialog__footer {
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
  .group-footer {
    // 确定按钮样式
    .el-button {
      height: 32px;
      border-radius: 6px;
    }
    .cancel {
      &:hover {
        border-color: #009456;
        color: #009456;
        background-color: transparent;
      }
    }
    .submit {
      border: none;
      background-color: #00b968;
      color: #fff;
      &:hover {
        cursor: pointer;
        background-color: #009456;
      }
    }
  }
}
</style>

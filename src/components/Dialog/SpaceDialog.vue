<script lang="ts" setup>
import spaceIcon2 from '@/assets/icons/spaceIcon.svg'
import type { FormInstance, FormRules } from 'element-plus'
import { addSpaceApi } from '@/api/spaces'
import { spaceIcon } from '@/data/iconBase64'
import { alphanumericRegex } from '@/data/data'

interface SpaceForm {
  icon: string
  spacename: string
  spacekey: string
  spacetype: string
  creator?: string
}

const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog'])

const router = useRouter()
const dialogVisible = ref(false)
const spacetypeList = ref([
  { label: '组织空间', value: 'organization' }
  // { label: '公共空间', value: 'public' }
])
const spaceForm = reactive<SpaceForm>({
  icon: '',
  spacename: '',
  spacekey: '',
  spacetype: 'organization',
  creator: JSON.parse(localStorage.getItem('userInfo')).username || ''
})
const spaceFormRef = ref<FormInstance>()
const spaceFormRules = reactive<FormRules<SpaceForm>>({
  spacekey: [
    { required: true, message: '请输入空间别名', trigger: 'blur' },
    { min: 4, max: 20, message: '空间别名长度在 4-20 之间', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/\s/.test(value)) {
          callback(new Error('非法输入：不能包含空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    { pattern: alphanumericRegex, message: '只能输入数字和英文字母', trigger: 'blur' }
  ],
  spacename: [
    { required: true, message: '请输入空间名称', trigger: 'blur' },
    { min: 2, max: 20, message: '空间名称长度在 2-20 之间', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/\s/.test(value)) {
          callback(new Error('非法输入：不能包含空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
  }
)

const addSpace = async () => {
  let res = await addSpaceApi(spaceForm)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success(`空间创建成功，3s后跳转至【${res.data.spacename}】空间...`)
    setTimeout(() => {
      router.push({
        path: `/${res.data.spacekey}/dashboard`,
        query: {
          sid: res.data.id,
          sname: res.data.spacename
        }
      })
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }, 3000)
  } else {
    ElMessage.error(res.msg)
  }
}

const toUploadImg = (uploadFile) => {
  if (uploadFile) {
    getBase64Image(uploadFile.raw).then((res) => {
      spaceForm.icon = res
    })
  }
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      spaceForm.icon ? spaceForm.icon : (spaceForm.icon = spaceIcon)
      if (spaceForm.spacekey === 'directory') return ElMessage.error('具有 空间标识符 的 空间 已存在。')
      addSpace()
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = async () => {
  resetForm(spaceFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="spaceDialog" v-model="dialogVisible" title="创建空间" width="424" :before-close="handleClose">
    <p>用信安空间，进行企业知识管理</p>
    <el-form ref="spaceFormRef" :rules="spaceFormRules" :model="spaceForm" label-width="120px" label-position="top">
      <el-form-item label="空间名称" prop="spacename">
        <div class="form-name">
          <el-upload class="upload-icon" accept=".png,.jpg,.svg" :auto-upload="false" :show-file-list="false" @change="toUploadImg">
            <div class="spaceIcon" v-if="!spaceForm.icon">
              <img :src="spaceIcon2" alt="" />
            </div>
            <img v-else class="spaceImg" :src="spaceForm.icon" alt="" />
          </el-upload>
          <el-input v-model="spaceForm.spacename" placeholder="可输入部门或团队名称" maxlength="20" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item label="空间别名" prop="spacekey">
        <el-input v-model="spaceForm.spacekey" placeholder="4-20个数字或字母" maxlength="20" show-word-limit clearable />
      </el-form-item>
      <p class="tip">空间别名用于成员访问空间的地址，设置后不可修改</p>
      <el-form-item label="空间类型" prop="spacetype">
        <el-select v-model="spaceForm.spacetype" placement="bottom-start" popper-class="selectList">
          <el-option v-for="(item, index) in spacetypeList" :key="'spacetypeList' + index" :label="item.label" :value="item.value">
            <div style="display: flex; align-items: center">
              <span>{{ item.label }}</span>
            </div>
            <img v-if="item.value === spaceForm.spacetype" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', spaceForm.spacename ? '' : 'submit-disabled']" type="primary" @click="handleSubmit(spaceFormRef)" :disabled="!spaceForm.spacename">
          新建
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
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
.selectList {
  li {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .icon {
      width: 24px !important;
      height: 24px !important;
      margin-right: 12px !important;
    }
  }
}
</style>

<style lang="scss">
.spaceDialog {
  border-radius: 8px;
  p {
    margin-top: -20px;
    margin-bottom: 28px;
    color: #8a8f8d;
    font-size: 14px;
  }
  .tip {
    margin-top: 12px;
    margin-bottom: 12px;
    min-height: 24px;
    color: rgba(0, 0, 0, 0.45);
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
  .el-select__wrapper {
    height: 40px;
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
    .upload-icon {
      width: 40px;
      height: 40px;
      margin-right: 6px;
      .spaceIcon {
        border-radius: 4px;
        padding: 6px;
        width: 40px;
        height: 40px;
        border: 1px solid #d8dad9;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .spaceImg {
        width: 38px;
        height: 38px;
        margin-right: 6px;
        border-radius: 4px;
      }
    }
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

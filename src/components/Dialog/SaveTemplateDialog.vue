<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import user2Icon from '@/assets/icons/user2.svg'
import book2Icon from '@/assets/icons/book2.svg'
import team2Icon from '@/assets/icons/team2.svg'
import home2Icon from '@/assets/icons/home2.svg'
import selectTemIcon from '@/assets/icons/selectTem.svg'
import documentIcon from '@/assets/icons/documentIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'
import { imgToBase64 } from '@/utils/imgToBase64'
import { addArticleTemApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean,
  info: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const dialogVisible = ref(false)
const templateTypeIcon = ref(home2Icon)
const saveTemFormRef = ref<FormInstance>()
const temForm = reactive({
  name: '',
  body: '',
  icon: '',
  target_type: '3', // 模版类型：0：仅自己可用，1：本知识库可用，2：本团队可用，3：本空间可用
  template_type: 'user', // 使用范围：user：用户，template：系统
  target_id: '', // 目标id
  content_type: '' // 文档类型
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
})
const contentType = ref([
  { label: '文档', icon: documentIcon, value: 'doc' },
  { label: '数据表', icon: formIcon, value: 'sheet' },
  { label: '脑图', icon: mindmapIcon, value: 'mind' },
  { label: 'PPT', icon: pptIcon, value: 'ppt' }
])
const temOpts = ref([
  { label: '本空间可用', icon: home2Icon, desc: '仅在本空间中可以使用', value: '3' },
  { label: '本团队可用', icon: team2Icon, desc: '仅在本团队中可以使用', value: '2' },
  { label: '本知识库可用', icon: book2Icon, desc: '仅在本知识库中可以使用', value: '1' },
  { label: '仅自己可用', icon: user2Icon, desc: '可以在你参与的所有知识库中使用', value: '0' }
])

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      temForm.name = props.info.title
      temForm.body = props.info.body
      temForm.content_type = props.info.type
      temForm.target_id = props.info.space
    }
  }
)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await handleImg()
      await addArticleTem(temForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleImg = () => {
  temForm.icon = contentType.value.find((item) => item.value === temForm.content_type)?.icon
  imgToBase64(temForm.icon)
    .then((res) => {
      if (res) {
        temForm.icon = res as string
      }
    })
    .catch((err) => {
      console.log('生成base64错误！', err)
    })
}

const addArticleTem = async (params) => {
  let res = await addArticleTemApi(params)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success('模板新建成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const toChangeType = (val) => {
  templateTypeIcon.value = temOpts.value.find((item) => item.value === val)?.icon
  switch (val) {
    case '0':
      temForm.target_id = ''
      break
    case '1':
      temForm.target_id = props.info.book
      break
    case '2':
      temForm.target_id = route.query.gid as string
      break
    case '3':
      temForm.target_id = props.info.space
      break
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
  resetForm(saveTemFormRef.value)
  dialogVisible.value = false
  templateTypeIcon.value = home2Icon
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="SaveTemplateDialog" v-model="dialogVisible" title="另存为模板" width="368" :before-close="handleClose">
    <el-form ref="saveTemFormRef" :rules="rules" :model="temForm" label-width="120px" label-position="top">
      <el-form-item label="模板名称" prop="name">
        <div class="form-name">
          <el-input v-model="temForm.name" placeholder="" />
        </div>
      </el-form-item>
      <el-form-item label="可用范围" prop="target_type">
        <div class="form-name">
          <el-select v-model="temForm.target_type" placeholder="" size="large" popper-class="temOps" @change="toChangeType">
            <template #prefix>
              <img class="prefix-icon" :src="templateTypeIcon" />
            </template>
            <el-option v-for="item in temOpts" :key="item.value" :label="item.label" :value="item.value">
              <div class="temOps-left">
                <div class="icon">
                  <span><img :src="item.icon" alt="" /></span>
                </div>
                <div class="content">
                  <span>{{ item.label }}</span>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
              <div class="temOps-right" v-if="temForm.target_type === item.value">
                <img :src="selectTemIcon" alt="" />
              </div>
            </el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['button', 'cancel']" type="" @click="handleCancel(saveTemFormRef)"> 取消 </el-button>
        <el-button :class="['button', 'submit']" type="primary" @click="handleSubmit(saveTemFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
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
.temOps {
  display: flex;
  flex-direction: column;
  li {
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    .temOps-left {
      display: flex;
      align-items: center;
      .icon,
      img {
        width: 20px;
        margin-right: 16px;
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 11px 0;
        p,
        span {
          line-height: 22px;
          color: #262626;
        }
      }
    }
  }
}
.SaveTemplateDialog {
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

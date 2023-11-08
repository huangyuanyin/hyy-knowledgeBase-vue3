<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { addArticleApi, editArticleApi, getArticleApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean,
  parent: Number,
  type: {
    type: String,
    default: 'add'
  },
  id: Number
})

const emit = defineEmits(['closeDialog'])

const route = useRoute()
const refreshStroe = useRefreshStore()
const spaceType = ref('')
const linkDialogTitle = ref('添加链接')
const dialogVisible = ref(false)
const linkFormRef = ref<FormInstance>()
const linkForm = reactive({
  title: '',
  body: '',
  description: '',
  type: 'links',
  parent: null,
  space: '',
  book: '',
  open_windows: true
})
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入链接', trigger: 'blur' }]
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (props.type === 'edit') {
      linkDialogTitle.value = '编辑链接'
      getArticleDetail(props.id)
    } else {
      linkDialogTitle.value = '添加链接'
    }
    spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
    linkForm.space = spaceType.value === '个人' ? (localStorage.getItem('personalSpaceId') as string) : (route.query.sid as string)
    linkForm.book = route.query.lid as string
    linkForm.parent = props.parent
  }
)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(linkForm))
      params.open_windows = linkForm.open_windows ? '1' : '0'
      props.type === 'add' ? addArticle(params) : editArticle(props.id, params)
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 新增链接
const addArticle = async (params) => {
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success('新建成功')
    refreshStroe.setRefreshBookList(true)
  } else {
    ElMessage.error(res.msg)
  }
}

// 获取链接详情
const getArticleDetail = async (id) => {
  let res = await getArticleApi(id)
  if (res.code === 1000) {
    linkForm.title = res.data.title
    linkForm.description = res.data.description
    linkForm.open_windows = res.data.open_windows === '1' ? true : false
  } else {
    ElMessage.error(res.msg)
  }
}

// 修改链接
const editArticle = async (id, params) => {
  let res = await editArticleApi(id, params)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success('修改成功')
    refreshStroe.setRefreshBookList(true)
  } else {
    ElMessage.error(res.msg)
  }
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
  resetForm(linkFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="linkDialog" v-model="dialogVisible" :title="linkDialogTitle" width="520" :before-close="handleClose">
    <p>通过添加网页链接，可插入非本知识库的内容</p>
    <el-form ref="linkFormRef" :rules="rules" :model="linkForm" label-width="120px" label-position="top">
      <el-form-item label="标题" prop="title">
        <div class="form-name">
          <el-input v-model="linkForm.title" placeholder="" />
        </div>
      </el-form-item>
      <el-form-item label="网页链接" class="form-description" prop="description">
        <el-input v-model="linkForm.description" placeholder="" />
      </el-form-item>
      <el-form-item label="" class="form-description" prop="open_windows">
        <el-checkbox v-model="linkForm.open_windows" label="在新标签页打开" size="large" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['button', 'cancel']" type="" @click="handleCancel(linkFormRef)"> 取消 </el-button>
        <el-button :class="['button', 'submit']" type="primary" @click="handleSubmit(linkFormRef)"> 确认 </el-button>
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
.linkDialog {
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
  .el-checkbox__label {
    color: #262626 !important;
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

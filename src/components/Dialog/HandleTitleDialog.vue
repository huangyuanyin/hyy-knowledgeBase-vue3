<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { ArticleInfo } from '@/type/article'

const props = defineProps({
  isShow: Boolean
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const infoStore = useInfoStore()
const dialogVisible = ref(false)
const titleFormRef = ref<FormInstance>()
const titleForm = reactive({
  title: '',
  body: '',
  description: '',
  space: null,
  book: null
})
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (dialogVisible.value) {
      titleForm.title = (infoStore.currentArticleInfo as ArticleInfo).title
      titleForm.description = (infoStore.currentArticleInfo as ArticleInfo).description
      titleForm.book = (infoStore.currentArticleInfo as ArticleInfo).book
      titleForm.space = (infoStore.currentArticleInfo as ArticleInfo).space
      titleForm.body = (infoStore.currentArticleInfo as ArticleInfo).body
    }
  }
)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      useArticle().handleEditArticle((infoStore.currentArticleInfo as ArticleInfo).id, titleForm, () => {
        router.push({
          path: route.path,
          query: {
            sid: infoStore.currentQuery.sid,
            sname: infoStore.currentQuery.sname,
            gid: infoStore.currentQuery.gid,
            gname: infoStore.currentQuery.gname,
            lid: infoStore.currentQuery.lid,
            lname: infoStore.currentQuery.lname,
            aid: infoStore.currentQuery?.aid,
            aname: titleForm.title
          }
        })
        handleClose()
      })
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
  resetForm(titleFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="handleTitleDialog" v-model="dialogVisible" title="编辑信息" width="520" :before-close="handleClose" :append-to-body="true">
    <el-form ref="titleFormRef" :rules="rules" :model="titleForm" label-width="120px" label-position="top">
      <el-form-item label="名称" prop="title">
        <div class="form-name">
          <el-input v-model="titleForm.title" placeholder="" />
        </div>
      </el-form-item>
      <el-form-item label="描述" class="form-description">
        <el-input v-model="titleForm.description" placeholder="" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['button', 'cancel']" type="" @click="handleCancel(titleFormRef)"> 取消 </el-button>
        <el-button :class="['button', 'submit']" type="primary" @click="handleSubmit(titleFormRef)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.handleTitleDialog {
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

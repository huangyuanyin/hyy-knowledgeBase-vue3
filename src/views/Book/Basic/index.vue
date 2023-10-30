<script lang="ts" setup>
import { editLibraryApi, getLibraryDetailApi } from '@/api/library'
import { FormInstance, FormRules } from 'element-plus'

interface BookForm {
  name: string
  slug: string
  description: string
  avatar: string
  space: string
  group: string
  stacks: string
}

const route = useRoute()
const bookId = ref(Number(route.query.lid) || null)
const bookFormRef = ref<FormInstance>()

const bookForm = reactive<BookForm>({
  name: '',
  slug: '',
  description: '',
  avatar: '',
  space: route.query.sid as string,
  group: (route.query.gid as string) || '123',
  stacks: (route.query.stackId as string) || '107'
})
const rules = reactive<FormRules<BookForm>>({
  name: [
    { required: true, message: '请输入知识库名称，长度在 2-50 之间', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入知识库名称，长度在 2-50 之间', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(bookForm))
      editLibrary(params, bookId.value)
    }
  })
}

const editLibrary = async (params, id) => {
  let res = await editLibraryApi(params, id)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    router.push({
      path: `/${route.path.split('/')[1]}/bookSetting/basic`,
      query: {
        sname: route.query.sname,
        sid: route.query.sid,
        lname: (res.data as any).name,
        lid: (res.data as any).id
      }
    })
  } else {
    ElMessage.error(res.msg)
  }
}

const getBooksDetail = async (id) => {
  let res = await getLibraryDetailApi(id)
  if (res.code === 1000) {
    bookForm.name = (res.data as any).name
    bookForm.slug = (res.data as any).slug
    bookForm.avatar = (res.data as any).icon
    bookForm.description = (res.data as any).description
  } else {
    ElMessage.error(res.msg)
  }
}

const uploadImg = () => {
  ElMessage.warning('该功能暂未开放，敬请期待')
}

onMounted(() => {
  getBooksDetail(bookId.value)
})
</script>

<template>
  <div class="Basic_wrap">
    <div class="header">知识库信息</div>
    <div class="box">
      <el-form ref="bookFormRef" :model="bookForm" :rules="rules" label-width="120px" class="bookForm" status-icon label-position="top">
        <el-form-item label="图标和名称" prop="name">
          <div class="icon-tag">
            <img v-if="!bookForm.avatar" src="/src/assets/icons/spaceIcon.svg" alt="" />
            <img v-else :src="bookForm.avatar" alt="" />
          </div>
          <el-input v-model="bookForm.name" placeholder="如：就叫小黄好了" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="bookForm.description" type="textarea" rows="7" placeholder="如：产品设计与研发" />
        </el-form-item>
        <el-form-item label="封面">
          <div class="cover">
            <el-image src="/src/assets/img/cover.png" fit="contain" />
            <el-button @click="uploadImg"> 重新上传 </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm(bookFormRef)"> 更新信息 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Basic_wrap {
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
    .bookForm {
      :deep(.el-form-item__label) {
        line-height: 40px;
      }
      .el-input {
        height: 40px;
        max-width: 448px;
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
        img {
          width: 40px;
          height: 40px;
          margin-right: 16px;
          border-radius: 6px;
        }
      }
      .cover {
        display: flex;
        align-items: flex-end;
        .el-image {
          width: 280px;
          height: 140px;
          margin-right: 16px;
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

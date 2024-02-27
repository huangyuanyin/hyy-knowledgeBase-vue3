<script lang="ts" setup>
import spaceIcon2 from '@/assets/icons/spaceIcon.svg'
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { editSpacesApi } from '@/api/spaces/index'
import { spaceIcon } from '@/data/iconBase64'

interface SpaceForm {
  spacename: string
  spacekey: string
  spacetype: string
  description: string
  icon: string
}

const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const icon = ref('')
const spaceFormRef = ref<FormInstance>()
const spaceForm = reactive<SpaceForm>({
  spacename: '',
  spacekey: '',
  spacetype: '',
  description: '',
  icon: spaceIcon
})
const rules = reactive<FormRules<SpaceForm>>({
  spacename: [
    { required: true, message: '请输入空间名称，长度在 2-20 之间', trigger: 'blur' },
    { min: 2, max: 20, message: '请输入空间名称，长度在 2-20 之间', trigger: 'blur' },
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
  ],
  spacekey: [{ required: true, message: '请填写域名', trigger: 'blur' }],
  description: [{ max: 200, message: '长度需小于200个字符', trigger: 'blur' }]
})

watchEffect(() => {
  nextTick(() => {
    icon.value = infoStore.currentSpaceInfo.icon || spaceIcon2
  })
})

const toUploadImg = (uploadFile) => {
  if (uploadFile) {
    getBase64Image(uploadFile.raw).then((res) => {
      spaceForm.icon = res
    })
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(spaceForm))
      params.spacekey = route.path.split('/')[1]
      editSpaces(params, infoStore.currentQuery?.sid)
    }
  })
}

const editSpaces = async (params, id) => {
  let res = await editSpacesApi(params, id)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    router.push({
      path: `/${route.path.split('/')[1]}/organize/settings`,
      query: {
        sname: spaceForm.spacename,
        sid: infoStore.currentQuery?.sid
      }
    })
    infoStore.setCurrentSpaceInfo(res.data)
    refreshStore.setRefreshSpaceSet(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const getDetailSpaces = async () => {
  const { spacename, spacekey, spacetype, description, icon } = infoStore.currentSpaceInfo
  spaceForm.spacename = spacename
  spaceForm.spacekey = 'http://10.4.150.55:8080/' + spacekey + '/dashboard'
  spaceForm.spacetype = spacetype
  spaceForm.description = description
  spaceForm.icon = icon
}

const changeIcon = (icon: string) => {
  spaceForm.icon = icon
}

onMounted(() => {
  getDetailSpaces()
})
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
          <el-input v-model="spaceForm.spacekey" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="空间描述" prop="description">
          <el-input v-model="spaceForm.description" type="textarea" maxlength="200" show-word-limit rows="7" placeholder="如：让天下没有难做的生意" />
        </el-form-item>
        <el-form-item label="空间标识">
          <div class="icon-tag">
            <SelectIconPopver @changeIcon="changeIcon">
              <img :src="spaceForm.icon" alt="" cursor-pointer />
            </SelectIconPopver>
            <el-upload v-model="spaceForm.icon" class="upload" action="" accept=".png,.jpg,.svg" :auto-upload="false" :show-file-list="false" @change="toUploadImg">
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

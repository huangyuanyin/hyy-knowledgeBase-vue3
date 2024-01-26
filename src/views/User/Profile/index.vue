<script lang="ts" setup>
import { avatar } from '@/data/data'
import { FormInstance, FormRules } from 'element-plus'
import { UserInfo } from '@/type/user'

const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
const userFormRef = ref<FormInstance>()
const userForm = reactive<UserInfo>({
  avatar: '',
  name: '',
  nickname: '',
  username: '',
  description: '',
  dept: userInfo.dept,
  post: userInfo.post
})
const rules = reactive<FormRules<UserInfo>>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '请输入昵称，长度在 2-10 之间', trigger: 'blur' }
  ]
})
const deptList = ref([])
const postList = ref([])

const { deptList: dlist, postList: plist, getDepartments, getPost } = useUser()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      delete userForm.avatar
      const params = {
        name: userForm.name,
        nickname: userForm.nickname,
        username: userForm.username,
        post: userForm.post,
        dept: userForm.dept
      }
      useUser().editUserInfo(userInfo.userId, params)
    }
  })
}

const handleChange = (val: any, type) => {
  if (type === 'dept') {
    userForm.dept = val[val.length - 1]
  } else {
    userForm.post = val[val.length - 1]
  }
}

onMounted(async () => {
  await useUser().getUserInfo(userInfo.username, (res: UserInfo) => {
    if (Reflect.ownKeys(res).length) {
      userForm.avatar = 'http://10.4.150.56:8032/' + res.avatar
      userForm.name = res.name
      userForm.nickname = res.nickname
      userForm.username = res.username
      userForm.dept = res.dept
      userForm.post = res.post[0]
    }
  })
  await getDepartments()
  await getPost()
  deptList.value = dlist.value
  postList.value = plist.value
})
</script>

<template>
  <div class="Profile_wrap">
    <div text-20px text="#262626" font-600 line-height-28px mb-24px>个人信息</div>
    <div class="box">
      <el-form class="userForm" ref="userFormRef" :model="userForm" :rules="rules" label-width="120px" status-icon label-position="top">
        <el-form-item label="头像">
          <div flex items-center>
            <img w-80px h-80px mr-16px rounded-6px cursor-pointer :src="avatar" alt="" />
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="必填" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userForm.description" type="textarea" rows="7" placeholder="简单介绍一下你自己" />
        </el-form-item>
        <div flex w-full justify-between>
          <el-form-item label="部门" flex-1 mr-20px>
            <el-cascader
              v-model="userForm.dept"
              :options="deptList"
              :props="{
                value: 'id',
                label: 'name'
              }"
              @change="handleChange($event, 'dept')"
              placeholder="请选择部门"
            >
              <template #default="{ data }">
                <span>{{ data.name }}</span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="职位" flex-1 ml-20px>
            <el-cascader
              v-model="userForm.post"
              :options="postList"
              :props="{
                value: 'id',
                label: 'name'
              }"
              @change="handleChange($event, 'post')"
              placeholder="请选择职位"
            >
              <template #default="{ data }">
                <span>{{ data.name }}</span>
              </template>
            </el-cascader>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm(userFormRef)"> 更新信息 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Profile_wrap {
  margin: auto;
  max-width: 1080px;

  .box {
    max-width: 668px;
    .userForm {
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

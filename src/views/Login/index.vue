<script lang="ts" setup>
import { loginApi } from '@/api/user/index'
import { useLogin } from './hooks/useLogin'
import { LoginForm, UseLoginOptions } from '@/type/loginType'

const form: LoginForm = reactive({
  username: '',
  password: ''
})
const formRef = ref<any>(null)
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loginOptions: UseLoginOptions = {
  api: loginApi as (data: Record<string, any>) => Promise<any>,
  formRules
}

const { loading, login } = useLogin(form, loginOptions)

const handleLogin = async () => {
  await login(formRef.value, form)
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-content">
      <div class="login-content-title">信安知识库</div>
      <el-form class="login-content-form" ref="formRef" :model="form" :rules="formRules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <i-ep-Avatar />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="form.password" @keyup.enter="handleLogin()">
            <template #prefix>
              <i-ep-Key />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-content-form-btn">
          <el-button :loading="loading" type="primary" @click="handleLogin()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrap {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/img/login-bg.jpg');
  background-size: 100%;
  background-repeat: round;
  .login-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    &-title {
      width: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-bottom: 1px solid #ddd;
    }
    &-form {
      padding: 30px 30px;
      &-btn {
        text-align: center;
        button {
          width: 100%;
          height: 36px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
@/views/Login/types/login ./type/login ../../type/login @/views/Login/type/login @/views/Login/Hooks/useLogin ../../type/login @/type/loginType

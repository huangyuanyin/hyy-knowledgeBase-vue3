<template>
  <div class="NoPermission_wrap">
    <el-result icon="error" title="暂无访问权限" sub-title="哎呦喂，你没有权限访问该模块，速去与管理员联系请求访问权限！">
      <template #extra>
        <el-button type="primary" @click="toPath">去个人空间逛逛</el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const path = ref('')

const toPath = () => {
  router.replace({
    path: '/dashboard'
  })
}
</script>

<style lang="scss" scoped>
.NoPermission_wrap {
}
</style>

<script setup lang="ts">
const aaa = () => {
  ElMessage({
    message: '恭喜你，这是一条成功消息',
    type: 'success'
  })
}
</script>

<template>
  <el-button type="primary" @click="aaa">Primary</el-button>
  <span class="red">HelloWorld</span>
</template>

<style scoped lang="scss">
.red {
  color: $red;
}
</style>

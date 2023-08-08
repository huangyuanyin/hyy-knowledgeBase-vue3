<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { login } from '@/api/user/index'

const login2 = async (password: string, username: string) => {
  const res = await login({ password, username })
  if (res.code === 200) {
    console.log(`output->`, res)
  }
}

login2('123456', 'huangyuanyin')
</script>

<template>
  <HelloWorld />
</template>

<style scoped></style>

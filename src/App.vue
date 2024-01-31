<script setup lang="ts">
import { disabledControl } from '@/utils/tool'

onMounted(() => {
  import.meta.env.MODE !== 'development' && disabledControl()
})
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
@import '../src/style/base.scss';
</style>

<template>
  <el-container class="layout-wrap">
    <el-aside class="layout-wrap-left">
      <Sidebar />
    </el-aside>
    <el-main class="layout-wrap-right">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.layout-wrap {
  width: 100vw;
  height: 100vh;
  &-left {
    width: 210px;
    background-color: #fafafa;
  }
  &-right {
    padding: 26px 36px;
  }
}
</style>

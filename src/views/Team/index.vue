<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'

const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()
</script>

<template>
  <div class="Team_wrap">
    <div class="header">团队</div>
    <CommonList :libraryList="libraryList" />
    <TableComp :header="['名称', '简介', '成员', '加入时间', '']" />
  </div>
</template>

<style lang="scss" scoped>
.Team_wrap {
  max-width: 1585px;
  .header {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
  :deep(.CommonList_wrap) {
    margin-bottom: 26px;
  }
}
</style>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'

const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()
</script>

<template>
  <div class="Library_wrap">
    <div class="header">知识库</div>
    <!-- <div style="display: flex; justify-content: flex-end">
      <CooperatePopver :menuItems="commonLibraryData" />
    </div> -->
    <CommonList :list="libraryList" />
    <div class="library_box">
      <div class="libraryList">
        <SwitchModuleItem
          :moduleType="'operation'"
          :moduleGenre="'my'"
          :moduleGenreData="[
            {
              type: 'my',
              name: '我个人的'
            },
            {
              type: 'public',
              name: '公共的'
            }
          ]"
        />
        <LibraryTable />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Library_wrap {
  max-width: 1585px;
  .header {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
  .library_box {
    margin-top: 28px;
    .libraryList {
      margin-bottom: 4px;
    }
  }
}
</style>

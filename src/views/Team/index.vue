<script lang="ts" setup>
import { teamsData } from '@/data/data'
import { getLibraryApi } from '@/api/library'

const teamInput = ref('')

const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()
</script>

<template>
  <div class="Team_wrap">
    <div class="header">
      <span>团队</span>
      <div class="button">
        <el-input v-model="teamInput" class="w-50 m-2" placeholder="搜索团队" clearable>
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
        <el-button>
          <template #icon>
            <img class="addIcon" src="/src/assets/icons/addIcon.svg" alt="" />
            <img class="addIcon_hover" src="/src/assets/icons/addIcon_hover.svg" alt="" />
          </template>
          新建团队
        </el-button>
      </div>
    </div>
    <CommonList :libraryList="libraryList" />
    <TableComp :header="['名称', '简介', '成员', '加入时间', '']" type="team" :data="teamsData" />
  </div>
</template>

<style lang="scss" scoped>
.Team_wrap {
  max-width: 1585px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    .button {
      display: flex;
      align-items: center;
      color: #262626;
      .el-input {
        margin-right: 12px;
        max-width: 164px;
      }
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }

      .el-button {
        border-radius: 6px;
        .addIcon {
          display: flex;
        }
        .addIcon_hover {
          display: none;
        }
        &:hover {
          color: #009456;
          border-color: #009456;
          background-color: #fff;
          .addIcon {
            display: none;
          }
          .addIcon_hover {
            display: flex;
          }
        }
      }
    }
  }
  :deep(.CommonList_wrap) {
    margin-bottom: 26px;
  }
}
</style>

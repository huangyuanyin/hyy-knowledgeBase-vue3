<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'

const infoStore = useInfoStore()
const currentSidebar = ref(infoStore.currentSidebar) // 当前类型：个人、公共
const libraryTable = ref([])
const libraryInput = ref('')
const isShowsLibraryDialog = ref(false)

onMounted(async () => {
  const { libraryList, fetchLibrary } = await useLibraryApi(getLibraryApi, { Public: 1 })
  await fetchLibrary()
  libraryTable.value = libraryList.value
  bus.emit('getLibraryList', libraryTable.value)
})
</script>

<template>
  <div class="Library_wrap">
    <div class="header">知识库</div>
    <!-- <div style="display: flex; justify-content: flex-end">
      <CooperatePopver :menuItems="commonLibraryData" />
    </div> -->
    <CommonList :list="libraryTable" />
    <div class="library_box">
      <div class="libraryList">
        <SwitchModuleItem
          v-if="currentSidebar === 'Sidebar'"
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
        <SwitchModuleItem
          v-else
          :moduleGenre="'my'"
          :moduleGenreData="[
            {
              type: 'my',
              name: '来自团队的'
            },
            {
              type: 'public',
              name: '邀请协作的'
            }
          ]"
        >
          <template #right>
            <div class="button">
              <el-input v-model="libraryInput" placeholder="搜索知识库" clearable>
                <template #prefix>
                  <i-ep-Search />
                </template>
              </el-input>
              <el-button @click="isShowsLibraryDialog = true">
                <template #icon>
                  <img class="addIcon" src="/src/assets/icons/addIcon.svg" alt="" />
                  <img class="addIcon_hover" src="/src/assets/icons/addIcon_hover.svg" alt="" />
                </template>
                新建知识库
              </el-button>
            </div>
          </template>
        </SwitchModuleItem>
        <LibraryTable v-if="currentSidebar === 'Sidebar'" :cardList="libraryTable" />
        <TableComp v-else :header="['名称', '归属', '更新时间', '']" type="library" :data="libraryTable" />
        <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
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
  }
}
</style>

<script lang="ts" setup>
import { moduleData, moduleAddMenuData, documentsData } from '@/data/data'

const isShowsLibraryDialog = ref(false)

const hoveredDocument = ref<number | null>(null)

const handleModule = (id: number): void => {
  switch (id) {
    case 2:
      isShowsLibraryDialog.value = true
      break
    default:
      break
  }
}

const handleMouseEnter = (documentId: number): void => {
  if (hoveredDocument.value !== documentId) {
    hoveredDocument.value = documentId
  }
}
const handleMouseLeave = (documentId: number): void => {
  if (hoveredDocument.value === documentId) {
    hoveredDocument.value = null
  }
}
</script>

<template>
  <div class="Dashboard_wrap">
    <div class="title">开始</div>
    <div class="module">
      <template v-for="module in moduleData" :key="module.id">
        <AddOperationPopover :menuItems="moduleAddMenuData" :width="259" v-if="module.id === 1">
          <ModuleItem :module="module" />
        </AddOperationPopover>
        <ModuleItem :module="module" v-else @click="handleModule(module.id)" />
      </template>
    </div>
    <div class="docTitle">文档</div>
    <SwitchModuleItem :moduleType="'search'" />
    <table class="docTable">
      <tbody>
        <tr class="docItem" v-for="document in documentsData" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
          <td class="item-title">
            <div>
              <img :src="document.icon" alt="" />
              <div class="item-title-right">
                <el-tooltip effect="light" :content="document.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                  <span>{{ document.title }}</span>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top" :show-arrow="false">
                  <span class="editIcon">
                    <img v-show="hoveredDocument === document.id" src="src/assets/icons/editIcon.svg" alt="" />
                  </span>
                </el-tooltip>
              </div>
            </div>
          </td>
          <td class="item-user">
            <span class="username">{{ document.username }}</span>
            <span class="divider">/</span>
            <span class="library">{{ document.library }}</span>
          </td>
          <td class="item-time">
            <span>{{ document.time }}</span>
          </td>
          <td class="item-operation">
            <span v-show="hoveredDocument === document.id"><img src="src/assets/icons/moreIcon1_after.svg" alt="" /></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
</template>

<style lang="scss" scoped>
.Dashboard_wrap {
  min-height: 100%;
  margin-bottom: -26px;
  .title {
    font-size: 18px;
    color: #262626;
    margin-bottom: 22px;
  }
  .module {
    display: flex;
    margin-bottom: 28px;
  }
  .docTitle {
    font-size: 16px;
    color: #262626;
    margin-bottom: 16px;
    font-weight: 500;
    height: 32px;
    display: flex;
    align-items: flex-end;
  }
  .docTable {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    .docItem {
      height: 65px;
      &:hover {
        background-color: #fafafa;
      }
      td {
        padding: 16px 1px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .item-title {
        div {
          display: flex;
          align-items: center;
          img {
            width: 24px;
            min-width: 24px;
            height: 24px;
            margin-right: 16px;
          }
          .item-title-right {
            display: flex;
            align-items: center;
            max-width: 100%;
            span {
              font-size: 14px;
              line-height: 32px;
              color: #262626;
              cursor: pointer;
            }
            .editIcon {
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              margin-left: 12px;
              img {
                width: 16px;
                height: 16px;
                cursor: pointer;
              }
            }
          }
        }
      }
      .item-user {
        font-size: 14px;
        color: #8a8f8d;
        height: 65px;
        box-sizing: border-box;
        .library,
        .username {
          &:hover {
            color: #262626;
            cursor: pointer;
          }
        }
        .divider {
          margin: 0 4px;
        }
      }
      .item-time {
        min-width: 120px;
        font-size: 14px;
        color: #8a8f8d;
      }
      .item-operation {
        width: 34px;
        min-width: 34px;
      }
    }
  }
}
</style>

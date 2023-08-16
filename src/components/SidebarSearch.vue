<script lang="ts" setup>
import { menuItemsData } from '@/data/data'
</script>

<template>
  <div class="sidebar-search">
    <el-input class="search-input" placeholder="搜索" disabled>
      <template #prefix>
        <i-ep-Search />
      </template>
    </el-input>
    <AddOperationPopover :menuItems="menuItemsData" />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      margin-right: 12px;
      box-shadow: none;
      background-color: #eff0f0;
    }
    :deep(.el-input__prefix-inner) {
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>

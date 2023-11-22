<script lang="ts" setup>
import { moduleData, documentsData, moduleAddMenuData } from '@/data/data'

const isShowsLibraryDialog = ref(false)

const handleModule = (id: number): void => {
  switch (id) {
    case 2:
      isShowsLibraryDialog.value = true
      break
    case 3:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
    default:
      break
  }
}

const toAddArticle = (val: any): void => {
  console.log(val)
}
</script>

<template>
  <div class="Dashboard_wrap">
    <div class="title">开始</div>
    <div class="module">
      <template v-for="module in moduleData" :key="module.id">
        <AddOperationPopver v-if="module.id === 1" :menuItems="moduleAddMenuData" :width="259" @toAddArticle="toAddArticle">
          <ModuleItem :module="module" />
        </AddOperationPopver>
        <ModuleItem :module="module" v-else @click="handleModule(module.id)" />
      </template>
    </div>
    <div class="docTitle">文档</div>
    <SwitchModuleItem
      :moduleType="'search'"
      :moduleGenre="'edit'"
      :moduleGenreData="[
        {
          type: 'edit',
          name: '编辑过'
        },
        {
          type: 'public',
          name: '浏览过'
        }
      ]"
    />
    <TableComp :data="documentsData" type="dashboard" />
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
}
</style>

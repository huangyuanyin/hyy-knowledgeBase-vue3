<script lang="ts" setup>
const infoStore = useInfoStore()
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
}>({})

const toDeleteSpace = () => {
  isShowsDeleteDialog.value = true
  const { id, spacename, spacekey } = infoStore.currentSpaceInfo
  deleteInfo.value = {
    id: String(id),
    name: spacename,
    slug: spacekey
  }
}
</script>

<template>
  <div class="AdvancedSet_wrap">
    <div class="header">高级设置</div>
    <div class="box">
      <h2>删除空间</h2>
      <p>点击删除，确认后将正式进入删除流程。在 24 小时内可以对该操作进行撤销，空间删除过后内容将丢失，请谨慎操作。</p>
      <el-button type="danger" @click="toDeleteSpace">删除空间</el-button>
    </div>
  </div>
  <DeleteDialog title="删除空间" :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.AdvancedSet_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    h2 {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      line-height: 24px;
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 32px;
      color: #8a8f8d;
      font-size: 14px;
    }
  }
}
</style>

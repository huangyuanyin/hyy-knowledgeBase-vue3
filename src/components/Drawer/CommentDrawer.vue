<script lang="ts" setup>
const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toCloseDrawer'])

const handleClose = () => {
  emit('toCloseDrawer')
}

const toDo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}
</script>

<template>
  <el-drawer v-model="props.drawer" modal-class="CommentDrawer_modal" custom-class="CommentDrawer_wrap" title="评论（0）" :modal="false" size="305px" @close="handleClose">
    <div class="comment-list">
      <div class="empty">暂无回复</div>
    </div>
    <div class="submit_wrap">
      <div class="input_wrap">
        <div class="input" @click="toDo">
          <img src="/src/assets/icons/drawer/inputComment.svg" alt="" />
          <span>输入全文评论</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.CommentDrawer_modal {
  position: fixed !important;
  top: 52px !important;
  left: 100vh !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.CommentDrawer_wrap {
  position: fixed !important;
  top: 52px !important;
  right: 0px !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
  border-left: 1px solid rgba(0, 0, 0, 0.04) !important;
  .el-drawer__header {
    margin-bottom: 0;
    height: 52px;
    display: flex;
    align-items: center;
    padding-top: 0;
    span {
      font-size: 14px;
      color: #262626;
      font-weight: 700;
    }
  }
  .el-drawer__body {
    padding: 0;
  }
  .comment-list {
    height: calc(100vh - 104px);
    padding-bottom: 56px;
    box-sizing: border-box;
    .empty {
      padding: 20px;
      color: #8a8f8d;
      font-size: 14px;
    }
  }
  .submit_wrap {
    position: absolute;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 1px rgba(0, 0, 0, 0.02);
    .input_wrap {
      padding: 12px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
      cursor: text;
      .input {
        display: flex;
        align-items: center;
        width: 100%;
        height: 32px;
        padding: 0 10px;
        background-color: #f4f5f5;
        border-radius: 6px;
        span {
          font-size: 14px;
          color: #bec0bf;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>

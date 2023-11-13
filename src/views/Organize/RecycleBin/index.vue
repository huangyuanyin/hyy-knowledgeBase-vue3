<script lang="ts" setup></script>

<template>
  <div class="RecycleBin_wrap">
    <div class="header">
      <span>回收站</span>
      <div>
        <el-input placeholder="搜索回收站" disabled></el-input>
      </div>
    </div>
    <div class="box">
      <Empty text="功能暂未开放，敬请期待" height="400px" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.RecycleBin_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      height: 32px;
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
    }
  }
  .box {
    max-width: 1080px;
  }
}
</style>

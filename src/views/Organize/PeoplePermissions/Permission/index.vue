<template>
  <div class="Permission_wrap">
    <div class="header">权限设置</div>
    <div class="box">
      <div class="box-item">
        <h3>成员角色权限设置</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.Permission_wrap {
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
    &-item {
      margin-bottom: 20px;
      h3 {
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #262626;
        flex: auto;
        display: flex;
        align-items: center;
        margin-bottom: 22px;
      }
    }
  }
}
</style>

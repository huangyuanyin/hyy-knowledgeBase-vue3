<template>
  <div class="Webhooks_wrap">
    <div class="header">消息推送</div>
    <div class="box">
      <Empty text="功能暂未开放，敬请期待" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.Webhooks_wrap {
  margin: auto;
  max-width: 124vh;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    .Empty-wrap {
      height: auto !important;
    }
  }
}
</style>

<template>
  <div class="Book_wrap">
    <TeamHeader />
    <div class="announcement">
      <div>管理员可以添加自定义内容，向 全体团队成员展示</div>
      <img src="/src/assets/icons/rightArrowIcon.svg" alt="" />
    </div>
    <SwitchModuleItem moduleType="operation">
      <template v-slot:left> <span class="title">知识库</span> </template>
    </SwitchModuleItem>
    <LibraryTable title="知识库分组" :show-delete="false" :show-move="false" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.Book_wrap {
  margin: -26px -36px !important;
  padding: 0 36px;
  width: 100%;
  .announcement {
    margin-top: 20px;
    margin-bottom: 32px;
    height: 57px;
    border-radius: 8px;
    color: #bec0bf;
    border: 1px dashed #d8dad9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      color: #bec0bf;
      cursor: pointer;
      font-size: 14px;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    img {
      transform: rotate(180deg);
    }
  }
}
</style>

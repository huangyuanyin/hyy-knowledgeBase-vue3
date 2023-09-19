<template>
  <div class="Public_wrap">
    <div class="header">
      <span>公共区</span>
      <div class="tag">
        <img src="/src/assets/icons/publicTagIcon.svg" alt="" />
        <el-tooltip class="box-item" effect="dark" content="公共区内容面向空间所有成员开放" placement="bottom">
          <span>全员可见</span>
        </el-tooltip>
      </div>
    </div>
    <div class="announcement">
      <div>管理员可以添加面向全体成员的公告信息</div>
      <img src="/src/assets/icons/rightArrowIcon.svg" alt="" />
    </div>
    <div class="content">
      <SwitchModuleItem moduleType="operation">
        <template v-slot:left> <span class="title">知识库</span> </template>
      </SwitchModuleItem>
      <LibraryTable title="知识库分组" :show-delete="false" :show-move="false" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.Public_wrap {
  max-width: 1585px;
  .header {
    display: flex;
    align-items: center;
    span {
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      font-weight: 700;
      color: #262626;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    .tag {
      display: flex;
      align-items: center;
      margin-left: 16px;
      border-radius: 6px;
      background-color: #f4f5f5;
      font-size: 12px;
      padding: 5px;
      display: inline-flex;
      height: 22px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        width: 12px;
        height: 12px;
      }
      span {
        line-height: 30px;
        margin-left: 4px;
        font-size: 12px;
        font-weight: 400;
        height: 30px;
      }
    }
  }
  .announcement {
    margin-top: 20px;
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
  .content {
    margin-top: 48px;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #000;
    }
  }
}
</style>

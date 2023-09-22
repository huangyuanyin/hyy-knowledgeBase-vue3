<template>
  <div class="Member_wrap">
    <TeamHeader />
    <div class="member-box">
      <div class="header">
        <h2>
          成员
          <span class="counts">1</span>
          <el-tooltip effect="dark" content="绑定部门后，部门成员访问该团队时将自动成为团队成员，未访问过的成员不生效。" placement="top">
            <span class="departMemberIcon">
              <img src="/src/assets/icons/departMemberIcon.svg" alt="" />
              绑定部门成员
            </span>
          </el-tooltip>
        </h2>
        <div>
          <el-input v-model="memberInput" placeholder="搜索成员" clearable>
            <template #prefix>
              <i-ep-Search />
            </template>
          </el-input>
          <el-button> 添加成员 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const memberInput = ref('')
</script>

<style lang="scss" scoped>
.Member_wrap {
  margin: -26px -36px !important;
  padding: 0 36px;
  width: 100%;
  .member-box {
    margin-top: 24px;
    padding-left: 36px;
    padding-right: 36px;
    max-width: 1664px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        font-size: 16px;
        color: #262626;
        display: flex;
        align-items: center;
        .counts {
          margin-left: 12px;
          margin-top: 2px;
          padding: 0 8px;
          background-color: #eff0f0;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 500;
          color: #585a5a;
          line-height: 20px;
          box-sizing: border-box;
        }
        .departMemberIcon {
          color: #585a5a;
          margin-left: 30px;
          font-size: 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            width: 16px;
            min-width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }
      div {
        .el-input {
          margin-right: 12px;
          max-width: 164px;
        }
        :deep(.el-input__wrapper) {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          box-shadow: none;
          &:hover {
            border-color: #0bd07d;
          }
        }
        .el-button {
          border-radius: 6px;
          background-color: #00b96b;
          color: #fff;
          border: none;
          &:hover {
            color: #fff;
            border-color: #009456;
            background-color: #009456;
          }
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>
const moduleType = ref('my')

const changeType = (type: string) => {
  moduleType.value = type
}
</script>

<template>
  <div class="SwitchModuleItem-wrap">
    <div class="module-button">
      <label :class="[moduleType === 'my' ? 'module-active' : '']" @click="changeType('my')"><div>我个人的</div></label>
      <label :class="[moduleType === 'public' ? 'module-active' : '']" @click="changeType('public')"><div>公共的</div></label>
    </div>
    <div class="module-operation">
      <div class="addIcon">
        <img src="src/assets/icons/addIcon.svg" alt="" class="moreIcon" />
        <img src="src/assets/icons/downIcon.svg" alt="" />
      </div>
      <div class="styleIcon">
        <span class="">
          <img src="src/assets/icons/cardStyleIcon.svg" alt="" class="moreIcon" />
        </span>
        <div class="divider"></div>
        <span>
          <img src="src/assets/icons/listStyleIcon.svg" alt="" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SwitchModuleItem-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .module-button {
    padding: 3px;
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      border-radius: 6px;
      min-height: 28px;
      padding: 2px 16px;
      cursor: pointer;
      text-align: center;
      line-height: 28px;
      transition: background-color 0.3s, color 0.3s;
    }
  }
  .module-operation {
    height: 32px;
    display: flex;
    align-items: center;
    .addIcon {
      margin-left: 12px;
      height: 32px;
      width: 64px;
      border-radius: 6px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      line-height: 32px;
      border: 1px solid #e7e9e8;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        border-color: #009456;
      }
      img {
        width: 16px;
        height: 16px;
        margin-top: 7px;
      }
    }
    .styleIcon {
      display: flex;
      align-items: center;
      margin-left: 12px;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        width: 26px;
        height: 26px;
        &:hover {
          background-color: #eff0f0;
        }
      }
      div {
        display: flex;
        align-items: center;
        border-right: 1px solid #e7e9e8;
        height: 16px;
        position: relative;
        margin: 0 5px;
      }
    }
  }
  .module-active {
    background-color: #fff;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 1px rgba(0, 0, 0, 0.02);
  }
}
</style>

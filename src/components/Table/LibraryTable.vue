<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '我的知识库'
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  showMove: {
    type: Boolean,
    default: true
  }
})

const cardList = ref([
  {
    name: '信安世纪',
    items: []
  },
  {
    name: '信安世纪',
    items: [
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' }
    ]
  },
  {
    name: '信安世纪',
    items: [
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' }
    ]
  },
  {
    name: '信安世纪',
    items: [
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' },
      { title: 'dasda', time: '07-27 13:54' }
    ]
  }
])
</script>

<template>
  <div class="LibraryTable_wrap">
    <div class="header">
      <span>{{ props.title }}</span>
      <div class="right">
        <div class="divider"></div>
        <div class="operation">
          <span class="item"><img src="/src/assets/icons/addIcon.svg" alt="" class="moreIcon" /></span>
          <el-tooltip effect="dark" content="分组唯一，无法移动" placement="top" :show-arrow="false">
            <span class="item upIcon" v-if="props.showDelete"><img src="/src/assets/icons/downIcon_disabled.svg" alt="" /></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="分组唯一，无法移动" placement="top" :show-arrow="false">
            <span class="item downIcon" v-if="props.showDelete"><img src="/src/assets/icons/downIcon_disabled.svg" alt="" /></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="默认分组，无法删除" placement="top" :show-arrow="false">
            <span class="item deleteIcon" v-if="props.showMove"><img src="/src/assets/icons/deleteIcon_disabled.svg" alt="" /></span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="content">
      <LibraryCard :cardList="cardList" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LibraryTable_wrap {
  .header {
    display: flex;
    align-items: center;
    height: 40px;
    position: relative;
    margin-bottom: 8px;
    padding-top: 8px;
    span {
      font-size: 14px;
      min-width: 10px;
      color: #262626;
    }
    .right {
      flex: 1;
      display: none;
      align-items: center;
      .divider {
        flex: 1;
        margin-left: 8px;
        height: 1px;
        background: #e7e9e8;
      }
      .operation {
        height: 32px;
        border-radius: 6px;
        padding: 4px;
        border: 1px solid #e7e9e8;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        margin-left: 8px;

        box-sizing: border-box;
        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          &:not(:last-child) {
            margin-right: 4px;
          }
          &:hover {
            background-color: #eff0f0;
          }
        }
        .upIcon {
          transform: rotate(180deg);
        }
        .upIcon,
        .downIcon,
        .deleteIcon {
          &:hover {
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 0 0 -16px;
  }
  &:hover {
    .right {
      display: flex;
    }
  }
}
</style>

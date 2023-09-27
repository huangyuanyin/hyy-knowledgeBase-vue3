<script lang="ts" setup>
import { commonLibraryData } from '@/data/data'

type CommonLibraryItem = {
  title: string
}

const props = defineProps({
  list: {
    type: Array as () => Array<CommonLibraryItem>,
    default: () => []
  }
})
</script>

<template>
  <div class="CommonList_wrap">
    <div class="header">常用</div>
    <div class="list">
      <div class="item_box" v-for="(item, index) in props.list" :key="index">
        <div class="item active">
          <div class="item-left">
            <img src="/src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
            <div class="title">
              <span>{{ item.title }}</span>
              <img src="/src/assets/icons/publicIcon.svg" alt="" class="publicIcon" />
            </div>
          </div>
          <LibraryOperationPopver :menuItems="commonLibraryData">
            <div class="item-right">
              <img src="/src/assets/icons/moreIcon1_after.svg" alt="" class="moreIcon" />
            </div>
          </LibraryOperationPopver>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.CommonList_wrap {
  margin-top: 20px;
  padding: 16px 16px 6px 16px;
  background-color: #fafafa;
  border-radius: 8px;
  .header {
    color: #585a5a;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item_box {
      width: 33%;
      padding: 0 4px;
      margin-bottom: 16px;
      box-sizing: border-box;
      .item {
        min-height: 64px;
        padding: 19px 28px 16px 20px;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #f4f5f5;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-left {
          display: flex;
          align-items: center;
          .bookIcon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          .title {
            display: flex;
            align-items: center;
            cursor: pointer;
            span {
              font-size: 14px;
              color: #262626;
              line-height: 24px;
            }
            .publicIcon {
              width: 14px;
              height: 14px;
              margin-left: 4px;
            }
          }
        }
        &-right {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          margin-left: 10px;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            cursor: pointer;
            background-color: #e7e9e8;
          }
        }
        &:hover {
          cursor: grab;
          border: 1px solid #d9d9d9;
          .item-right {
            opacity: 1;
            .moreIcon {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>

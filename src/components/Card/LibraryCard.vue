<script lang="ts" setup>
import { commonLibraryData } from '@/data/data'
import { LibraryCard } from '@/type/card'

const props = defineProps({
  cardList: {
    type: Array as PropType<LibraryCard[]>,
    required: true
  },
  stackId: {
    type: String,
    default: ''
  }
})

const isShowsLibraryDialog = ref(false)
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})

const toDeleteLibrary = (val) => {
  isShowsDeleteDialog.value = true
  deleteInfo.value = val
}
</script>

<template>
  <template v-if="props.cardList.length">
    <div class="LibraryCard-wrap" v-for="(card, cardIndex) in props.cardList" :key="cardIndex">
      <div class="card-content">
        <div class="header">
          <div class="header-left">
            <img src="/src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
          </div>
          <div class="header-right">
            <div style="display: flex; align-items: center">
              <span>{{ card.name }}</span>
              <span class="publicIcon"><img src="/src/assets/icons/publicIcon.svg" alt="" /></span>
            </div>
            <LibraryOperationPopver :menuItems="commonLibraryData" @deleteLibrary="toDeleteLibrary(card)">
              <span class="moreIcon"><img src="/src/assets/icons/moreIcon1_after.svg" alt="" /></span>
            </LibraryOperationPopver>
          </div>
        </div>
        <ul v-if="card.items && card.items.length">
          <li v-for="(item, itemIndex) in card.items" :key="itemIndex">
            <div class="cardItem">
              <span class="title">{{ item.title }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </li>
        </ul>
        <div class="empty" v-else>
          <p>知识库暂无内容</p>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="addCard" @click="isShowsLibraryDialog = true">
      <div>
        <img src="/src/assets/icons/addIcon.svg" alt="" />
        新建知识库
      </div>
    </div>
  </template>
  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" :stackId="String(props.stackId)" />
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.LibraryCard-wrap {
  cursor: grab;
  width: calc(33.33333% - 16px);
  height: 218px;
  margin-left: 16px;
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e7e9e8;
  box-sizing: border-box;
  .card-content {
    position: relative;
    padding: 0 16px 0 16px;
    border-radius: 8px;
    &:hover {
      .moreIcon {
        display: flex !important;
      }
    }
    .header {
      height: 64px;
      display: flex;
      align-items: center;
      &-left {
        height: 32px;
        display: flex;
        align-items: center;
        .bookIcon {
          width: 24px;
          height: 24px;
          margin-right: 16px;
        }
      }
      &-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          cursor: pointer;
        }
        .publicIcon {
          width: 14px;
          min-width: 14px;
          height: 14px;
          line-height: 14px;
          margin-left: 5px;
        }
        .moreIcon {
          line-height: 16px;
          padding: 4px;
          width: 32px;
          height: 32px;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          border: 1px solid #e7e9e8;
          right: 12px;
          box-sizing: border-box;
        }
      }
    }
    ul {
      min-height: 116px;
      padding-top: 20px;
      margin-top: 16px;
      padding-left: 16px;
      margin-right: 4px;
      margin-left: 4px;
      border-top: 1px solid #e7e9e8;
      list-style: none;
      li {
        position: relative;
        &::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 4px;
          background-color: #8a8f8d;
          position: absolute;
          left: -16px;
          top: 50%;
          margin-top: -2px;
        }
      }
      .cardItem {
        color: #8a8f8d;
        font-size: 14px;
        line-height: 21px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .title {
          font-size: 14px;
          &:hover {
            color: #585a5a;
            cursor: pointer;
          }
        }
        .time {
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .empty {
      padding-top: 20px;
      border-top: 1px solid #e7e9e8;
      margin-top: 8px;
      min-height: 116px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        color: #8a8f8d;
        font-size: 12px;
      }
    }
  }
}
.addCard {
  cursor: pointer;
  display: flex;
  width: calc(33.33333% - 16px);
  color: #8a8f8d;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 214px;
  margin-left: 16px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px dashed #e7e9e8;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    img {
      width: 14px;
      height: 14px;
      margin-bottom: 8px;
    }
  }
}
</style>

<script lang="ts" setup>
import { getLibraryApi } from '@/api/library'
import { commonLibraryData } from '@/data/data'

const { libraryList, fetchLibrary } = useLibraryApi(getLibraryApi, { Public: 1 })
fetchLibrary()

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
  <div class="Library_wrap">
    <div class="header">知识库</div>
    <div style="display: flex; justify-content: flex-end">
      <CooperatePopver :menuItems="commonLibraryData" />
    </div>
    <div class="commonList">
      <div class="commonList_header">常用</div>
      <div class="list">
        <div class="item_box" v-for="(item, index) in libraryList" :key="index">
          <div class="item active">
            <div class="item-left">
              <img src="src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
              <div class="title">
                <span>{{ item.name }}</span>
                <img src="src/assets/icons/publicIcon.svg" alt="" class="publicIcon" />
              </div>
            </div>
            <LibraryOperationPopver :menuItems="commonLibraryData">
              <div class="item-right">
                <img src="src/assets/icons/moreIcon1_after.svg" alt="" class="moreIcon" />
              </div>
            </LibraryOperationPopver>
          </div>
        </div>
      </div>
    </div>
    <div class="library_box">
      <div class="libraryList">
        <SwitchModuleItem />
        <div class="content">
          <div class="libraryList_header">
            <span>我的知识库</span>
            <div class="right">
              <div class="divider"></div>
              <div class="operation">
                <span class="item"><img src="src/assets/icons/addIcon.svg" alt="" class="moreIcon" /></span>
                <el-tooltip effect="dark" content="分组唯一，无法移动" placement="top" :show-arrow="false">
                  <span class="item upIcon"><img src="src/assets/icons/downIcon_disabled.svg" alt="" /></span>
                </el-tooltip>
                <el-tooltip effect="dark" content="分组唯一，无法移动" placement="top" :show-arrow="false">
                  <span class="item downIcon"><img src="src/assets/icons/downIcon_disabled.svg" alt="" /></span>
                </el-tooltip>
                <el-tooltip effect="dark" content="默认分组，无法删除" placement="top" :show-arrow="false">
                  <span class="item deleteIcon"><img src="src/assets/icons/deleteIcon_disabled.svg" alt="" /></span>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="libraryList_content">
            <LibraryCard :cardList="cardList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Library_wrap {
  max-width: 1585px;
  .header {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
  .commonList {
    margin-top: 20px;
    padding: 16px 16px 6px 16px;
    background-color: #fafafa;
    border-radius: 8px;
    .commonList_header {
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
  .library_box {
    margin-top: 28px;
    .libraryList {
      margin-bottom: 4px;

      .content {
        &:hover {
          .right {
            display: flex;
          }
        }
      }
      &_header {
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
            .item {
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              width: 24px;
              height: 24px;
              border-radius: 6px;
              margin-right: 4px;

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

      .libraryList_content {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 0 0 0 -16px;
      }
    }
  }
}
</style>

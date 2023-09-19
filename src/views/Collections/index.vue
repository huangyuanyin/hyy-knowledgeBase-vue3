<script lang="ts" setup>
const isShowsGroupDialog = ref(false)
const groupActive = ref(0)
const groups = ref([
  {
    id: 0,
    name: '全部收藏',
    count: '两条内容'
  },
  {
    id: 1,
    name: '第一组',
    count: '三条内容'
  }
])
const groupMenuItems = [
  { type: 'item', icon: '', label: '编辑' },
  { type: 'item', icon: '', label: '删除' }
]

const toSelectGroup = (val: any) => {
  groupActive.value = val.id
}
</script>

<template>
  <div class="Collections_wrap">
    <div class="header">
      <span>收藏</span>
      <div class="search">
        <span><img src="/src/assets/icons/searchIcon.svg" alt="" /></span>
        <span><img src="/src/assets/icons/filterIcon.svg" alt="" /></span>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div :class="['group', groupActive === group.id ? 'groupActive' : '']" v-for="(group, index) in groups" :key="index" @click="toSelectGroup(group)">
          <div class="group-header">
            <span>{{ group.name }}</span>
            <span class="collectionGroupIcon">
              <el-tooltip effect="dark" content="新建分组" placement="top">
                <img v-if="group.name === '全部收藏'" src="/src/assets/icons/collectionGroupIcon.svg" alt="" @click="isShowsGroupDialog = true" />
              </el-tooltip>
              <LibraryOperationPopver :width="110" trigger="hover" :menuItems="groupMenuItems">
                <img v-if="group.name !== '全部收藏'" src="/src/assets/icons/moreIcon1.svg" alt="" @click="" />
              </LibraryOperationPopver>
            </span>
          </div>
          <div class="count">{{ group.count }} 条内容</div>
        </div>
      </div>
      <div class="right">
        <TableComp :header="['名称', '归属', '收藏时间']" type="star" />
      </div>
    </div>
  </div>
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" />
</template>

<style lang="scss" scoped>
.Collections_wrap {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 18px;
      color: #262626;
    }
    .search {
      display: flex;
      align-items: center;
      span {
        width: 24px;
        height: 24px;
        margin-left: 15px;
        margin-right: 5px;
        cursor: pointer;
      }
      img {
        width: 16px;
        min-width: 16px;
        height: 16px;
      }
    }
  }
  .content {
    display: flex;
    flex: 1;
    margin-top: 20px;
    margin-bottom: -26px;
    .left {
      height: calc(100vh - 44px - 26px);
      overflow: auto;
      width: 203px;
      min-width: 203px;
      border-right: 1px solid rgba(0, 0, 0, 0.04);
      padding: 0 12px 20px 0;
      box-sizing: border-box;
      .group {
        height: 74px;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:hover {
          background-color: #eff0f0;
          cursor: pointer;
        }
        &-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .collectionGroupIcon {
            width: 22px;
            height: 22px;
            img {
              cursor: pointer;
              width: 18px;
              min-width: 18px;
              height: 18px;
            }
          }

          span {
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #262626;
          }
        }
        .count {
          font-size: 12px;
          color: #8a8f8d;
        }
      }
      .groupActive {
        background-color: #eff0f0;
      }
    }
    .right {
      flex: 1;
      padding: 0px 24px;
    }
  }
}
</style>

<script lang="ts" setup>
import { libraryOperationData } from '@/data/data'

const state = reactive({
  defaultMenu: 'dashboard',
  headerActive: false
})

const { libraryList, getLibrary } = useLibrary()

onMounted(() => {
  getLibrary()
})

watchEffect(() => {
  const routerName = router.currentRoute.value.name
  state.defaultMenu = routerName.toString().toLowerCase()
  routerName === 'Library' ? (state.headerActive = true) : (state.headerActive = false)
})

const toLink = () => {
  router.push({ name: 'Library' })
}
</script>

<template>
  <div class="sidebar-wrap">
    <div class="sidebar-wrap-top">
      <div style="display: flex; flex-direction: column">
        <div class="sidebar-top">
          <div class="sidebar-top-left">
            <img src="@/assets/favicon.ico" />
            <span>信安知识库</span>
          </div>
          <div class="sidebar-top-right">
            <el-tooltip effect="dark" content="消息中心" placement="bottom">
              <span class="sidebar-top-right-tongzhi">
                <svg-icon iconName="icon-tongzhi" className="tongzhi_svg"></svg-icon>
                <sub class="sidebar-top-right-tongzhi-dot"></sub>
              </span>
            </el-tooltip>
            <UserPopver />
          </div>
        </div>
        <SidebarSearch />
        <div class="siderbar-menu">
          <el-menu :default-active="state.defaultMenu" class="menu-list" active-text-color="#262626" router>
            <el-menu-item index="dashboard">
              <i-ep-Stopwatch />
              <span>开始</span>
            </el-menu-item>
            <el-menu-item index="notes">
              <i-ep-Discount />
              <span>小记</span>
            </el-menu-item>
            <el-menu-item index="collections">
              <i-ep-Star />
              <span>收藏</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="siderbar-library">
        <div :class="['tree-header', state.headerActive ? 'tree-header-active' : '']" @click="toLink">
          <div class="tree-header-left">
            <span class="header-left-icon"><i-ep-CaretRight /></span>
            <span class="header-title">知识库</span>
          </div>
          <div class="tree-header-right"><i-ep-ArrowRight /></div>
        </div>
        <el-tree :data="libraryList" node-key="id" default-expand-all :expand-on-click-node="false">
          <template #default="{ data }">
            <span class="custom-tree-node">
              <div style="display: flex; align-items: center; flex: 1">
                <img src="@/assets/icons/bookIcon.svg" alt="" />
                <span class="title">{{ data.name }}</span>
                <span class="type-icon">
                  <img src="@/assets/icons/publicIcon.svg" alt="" />
                </span>
              </div>
              <LibraryOperationPopver :menuItems="libraryOperationData">
                <span class="more-icon">
                  <img src="@/assets/icons/moreIcon1.svg" alt="" />
                </span>
              </LibraryOperationPopver>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="siderbar-menu-more">
      <div class="siderbar-menu-more-item">
        <img src="@/assets/icons/moreIcon2.svg" alt="" />
        <span>更多</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-wrap {
  width: 100%;
  height: 100%;
  padding: 10px 12px 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .sidebar-wrap-top {
    flex: 1;
  }
  .sidebar-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 26px;
        height: 26px;
        margin-right: 4px;
      }
      span {
        color: #262626;
        font-size: 15px;
        font-weight: 700;
      }
    }
    &-right {
      display: flex;
      align-items: center;
      &-tongzhi {
        position: relative;
        margin-right: 3px;
        padding: 5px;
        line-height: 20px;
        height: 20px;
        width: 20px;
        border-radius: 6px;
        display: block;
        text-align: center;
        &:hover {
          cursor: pointer;
          background-color: #eff0f0;
        }
        &-dot {
          background-color: #117cee;
          color: #ffff;
          position: absolute;
          top: 20%;
          right: 20%;
          width: 8px;
          height: 8px;
          border-radius: 100%;
        }
      }
    }
  }
  .siderbar-menu {
    .menu-list {
      border: none;
      background-color: #fafafa;
      :deep(.el-menu-item) {
        height: 32px;
        border-radius: 6px;
        margin: 2px 0;
        padding-left: 10px;
        svg {
          margin-right: 10px;
        }
        &:hover {
          background-color: #eff0f0;
        }
      }
      :deep(.is-active) {
        background-color: #eff0f0;
      }
    }
  }
  .siderbar-library {
    margin-top: 14px;
    background-color: #fafafa;
    flex: 1;
    .tree-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      margin: 4px 0;
      &:hover {
        cursor: pointer;
        background-color: #eff0f0;
        border-radius: 6px;
      }
      .tree-header-left {
        display: flex;
        align-items: center;
        justify-content: center;
        .header-left-icon {
          width: 26px;
          height: 26px;
          cursor: pointer;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
          color: #8a8f8d;
          font-size: 14px;
          &:hover {
            border-radius: 6px;
            background-color: #d8dad9;
            color: #262626;
          }
        }
        .header-title {
          font-size: 14px;
          color: #262626;
        }
      }
      .tree-header-right {
        width: 14px;
        height: 14px;
        line-height: 14px;
        margin-right: 6px;
        svg {
          width: 100%;
          height: 100%;
          color: #8a8f8d;
        }
      }
    }
    .tree-header-active {
      background-color: #eff0f0;
      border-radius: 6px;
    }
    :deep(.el-tree) {
      background-color: #fafafa;
    }
    :deep(.el-tree-node__content) {
      height: 32px;
      &:hover {
        background-color: #eff0f0;
      }
    }
    :deep(.el-tree-node__expand-icon) {
      display: none;
    }
    .custom-tree-node {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      &:hover {
        .more-icon {
          display: flex;
        }
      }
      .title {
        margin-left: 6px;
        font-size: 14px;
        color: #585a5a;
        max-width: calc(100% - 48px);
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      .type-icon {
        margin-left: 4px;
        display: flex;
        align-items: center;
      }
      .more-icon {
        width: 20px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8a8f8d;
        display: none;
        &:hover {
          background-color: #d8dad9;
          border-radius: 6px;
          color: #262626;
        }
        img {
          width: 16px;
          height: 16px;
          &:hover {
            content: url('@/assets/icons/moreIcon1_after.svg');
          }
        }
      }
    }

    :deep(.el-tree-node__content) {
      margin: 4px 0;
      padding-left: 25px !important;
      padding-right: 4px !important;
      box-sizing: border-box;
      width: 100% !important;
      border-radius: 6px;
    }
  }
  .siderbar-menu-more {
    list-style: none;
    margin: 9px 0 7px 0;
    width: 100%;
    &-item {
      display: flex;
      align-items: center;
      padding: 0 4px 0 10px;
      height: 32px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
      span {
        font-size: 14px;
        color: #262626;
      }
      &:hover {
        background-color: #eff0f0;
        border-radius: 6px;
      }
    }
  }
}
</style>

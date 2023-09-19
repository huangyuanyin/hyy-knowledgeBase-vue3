<template>
  <div class="OrganizeSidebar_wrap">
    <div class="back">
      <img src="/src/assets/icons/arrowRightIcon.svg" alt="" />
      <span>返回空间</span>
    </div>
    <div class="title">
      <img src="/src/assets/icons/spaceIcon.svg" alt="" />
      <span>小黄</span>
    </div>
    <div class="menu">
      <el-tree :data="organizeMenu" node-key="id" highlight-current @node-click="handleClickNode">
        <template #default="{ data }">
          <span class="custom-tree-node">
            <div>
              <img :src="data.icon" alt="" />
              <span class="name">{{ data.title }}</span>
            </div>
            <span class="rightIcon" v-if="data.children.length">
              <img :class="[isNodeExpanded(data) ? 'is-expand' : '']" src="/src/assets/icons/organize/rightIcon.svg" alt="" />
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
const organizeMenu = [
  {
    id: 1,
    title: '空间总览',
    icon: '/src/assets/icons/organize/spaceIcon.svg',
    children: []
  },
  {
    id: 2,
    title: '人员与权限',
    icon: '/src/assets/icons/organize/memberIcon.svg',
    children: [
      {
        id: 201,
        title: '通讯录',
        icon: '',
        children: []
      },
      {
        id: 202,
        title: '权限设置',
        icon: '',
        children: []
      },
      {
        id: 203,
        title: '管理员设置',
        icon: '',
        children: []
      }
    ]
  },
  {
    id: 3,
    title: '团队管理',
    icon: '/src/assets/icons/organize/teamIcon.svg',
    children: []
  },
  {
    id: 4,
    title: '空间设置',
    icon: '/src/assets/icons/organize/setIcon.svg',
    children: [
      {
        id: 401,
        title: '空间信息',
        icon: '',
        children: []
      },
      {
        id: 402,
        title: '偏好设置',
        icon: '',
        children: []
      },
      {
        id: 403,
        title: '高级设置',
        icon: '',
        children: []
      }
    ]
  },
  {
    id: 5,
    title: '回收站',
    icon: '/src/assets/icons/organize/deleteIcon.svg',
    children: []
  }
]

const expandedNodes = ref([])
const handleClickNode = (node) => {
  if (isNodeExpanded(node)) {
    // 如果节点已展开，收缩它
    const index = expandedNodes.value.indexOf(node)
    if (index !== -1) {
      expandedNodes.value.splice(index, 1)
    }
  } else {
    // 如果节点未展开，展开它
    expandedNodes.value.push(node)
  }
}

const isNodeExpanded = (node) => {
  return expandedNodes.value.includes(node)
}
</script>

<style lang="scss" scoped>
.OrganizeSidebar_wrap {
  background-color: #fafafa;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px;
  .back {
    margin: 18px 0px 0px 6px;
    cursor: pointer;
    border-radius: 6px;
    padding: 5px 0px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      transform: rotate(90deg);
      margin-left: 3px;
      margin-right: 8px;
    }
    span {
      color: #8a8f8d;
      font-size: 12px;
      line-height: 20px;
    }
    &:hover {
      background-color: #eff0f0;
    }
  }
  .title {
    margin: 25px 0 25px 32px;
    display: flex;
    align-items: center;
    height: 48px;
    img {
      width: 48px;
      min-width: 48px;
      height: 48px;
      border-radius: 8px;
    }
    span {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      font-weight: 500;
      margin-left: 12px;
    }
  }
  .menu {
    margin-left: 6px;
    :deep(.el-tree) {
      background-color: #fafafa;
    }
    :deep(.el-tree-node__content) {
      padding: 5px 0 5px 26px;
      border-radius: 6px;
      &:hover {
        background-color: #eff0f0;
      }
    }
    :deep(.el-tree-node__expand-icon) {
      display: none;
    }
    :deep(.el-tree-node__content) {
      padding-left: 26px !important;
      margin-top: 9px;
    }
    .custom-tree-node {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      div {
        display: flex;
        align-items: center;
        flex: 1;
      }

      img {
        width: 16px;
        height: 14px;
      }
      .name {
        margin-left: 8px;
        font-size: 14px;
        line-height: 22px;
        color: #262626;
        max-width: calc(100% - 48px);
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      .rightIcon {
        margin-left: 10px;
        margin-right: 10px;
        width: 22px;
        display: flex;
        align-items: center;
        .is-expand {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>

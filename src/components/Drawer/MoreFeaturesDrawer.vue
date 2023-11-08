<script lang="ts" setup>
const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  },
  info: {
    type: Object,
    default: () => ({})
  }
})

const drawerTab = ref('operation')
const operationItems = [
  { icon: '/src/assets/icons/drawer/docSet.svg', text: '文档设置', type: 'label' },
  { type: 'hr' },
  { icon: '/src/assets/icons/drawer/fullScreen.svg', text: '全屏', type: 'label' },
  { icon: '/src/assets/icons/drawer/saveTem.svg', text: '另存为模板', type: 'label' },
  { icon: '/src/assets/icons/drawer/historyVersion.svg', text: '查看历史版本', type: 'label' },
  { icon: '/src/assets/icons/drawer/export.svg', text: '导出...', type: 'label' },
  { icon: '/src/assets/icons/drawer/copy.svg', text: '复制...', type: 'label' },
  { icon: '/src/assets/icons/drawer/move.svg', text: '移动...', type: 'label' },
  { icon: '/src/assets/icons/drawer/delete.svg', text: '删除...', type: 'label' }
]
const infoItems = ref([
  { icon: '/src/assets/icons/drawer/count.svg', text: '字数', value: '暂未统计', type: 'label' },
  { icon: '/src/assets/icons/drawer/historyVersion.svg', text: '历史版本', value: '暂未统计', type: 'label' },
  { text: '创建时间', value: '今天 09:34', type: 'label' },
  { text: '更新时间', value: '今天 12:47', type: 'label' },
  { icon: '/src/assets/icons/drawer/author.svg', text: '作者', value: '就叫小黄好了', type: 'label' },
  { type: 'hr' },
  { icon: '/src/assets/icons/drawer/views.svg', text: '阅读数', value: '暂未统计', type: 'label' },
  { icon: '/src/assets/icons/drawer/comment.svg', text: '评论数', value: '暂未统计', type: 'label' },
  { icon: '/src/assets/icons/drawer/like.svg', text: '点赞数', value: '暂未统计', type: 'label' }
])

watchEffect(() => {
  if (props.drawer) {
    infoItems.value[2].value = props.info.create_datetime
    infoItems.value[3].value = props.info.update_datetime
    infoItems.value[4].value = props.info.creator
  }
})

const handleClick = (tab) => {
  drawerTab.value = tab
}

const noUse = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}
</script>

<template>
  <el-drawer v-model="props.drawer" modal-class="MoreFeaturesDrawer_modal" custom-class="MoreFeaturesDrawer_wrap" :with-header="false" :modal="false" size="305px">
    <el-tabs class="drawerTab" v-model="drawerTab" @tab-change="handleClick">
      <el-tab-pane name="operation">
        <template #label>
          <img src="/src/assets/icons/drawer/operation.svg" alt="" />
        </template>
        <div class="operate-wrap">
          <div class="list">
            <template v-for="item in operationItems">
              <div v-if="item.type === 'label'" :class="['item', item.text === '删除...' ? 'delete' : '']" @click="noUse">
                <img :src="item.icon" alt="" />
                <div>{{ item.text }}</div>
              </div>
              <div v-if="item.type === 'hr'" class="hr"></div>
            </template>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="info">
        <template #label>
          <img src="/src/assets/icons/drawer/info.svg" alt="" />
        </template>
        <div class="info-wrap">
          <template v-for="item in infoItems">
            <div v-if="item.type === 'label'" class="item">
              <div class="item-left">
                <img v-if="item.icon" :src="item.icon" alt="" />
                <span v-else></span>
                {{ item.text }}
              </div>
              <div class="item-right">{{ item.value }}</div>
            </div>
            <div v-if="item.type === 'hr'" class="hr"></div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<style lang="scss">
.MoreFeaturesDrawer_modal {
  position: fixed !important;
  top: 52px !important;
  left: 100vh !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.MoreFeaturesDrawer_wrap {
  position: fixed !important;
  top: 52px !important;
  right: 0px !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
  border-left: 1px solid rgba(0, 0, 0, 0.04) !important;
  .el-drawer__body {
    padding: 0 !important;
  }
  .drawerTab {
    .el-tabs__nav-scroll {
      width: 100%;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__nav {
      width: 100%;
      display: flex;
      justify-content: space-around;
      .el-tabs__item {
        padding-left: 0;
        padding-right: 0;
        display: flex;
        align-items: center;
        img {
          width: 18px !important;
          height: 18px !important;
        }
      }
    }
    .operate-wrap {
      padding: 12px 20px 0 20px;
      .list {
        margin-top: 8px;
        background-color: #fafafa;
        border-radius: 8px;
        padding: 8px;
        .item {
          display: flex;
          align-items: center;
          height: 36px;
          line-height: 36px;
          padding: 10px 8px;
          box-sizing: border-box;
          border-radius: 6px;
          cursor: pointer;
          img {
            width: 18px;
            height: 18px;
          }
          div {
            font-size: 14px;
            color: #262626;
            margin-left: 8px;
          }
          &:hover {
            background-color: #eff0f0;
          }
        }
        .delete div {
          color: #df2a3f !important;
        }
        .hr {
          height: 1px;
          margin: 4px 8px;
          background-color: #eff0f0;
        }
      }
    }
    .info-wrap {
      padding: 12px 20px 0 20px;
      .item {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        font-size: 14px;
        font-family: Consolas;
        color: #262626;
        &-left {
          display: flex;
          align-items: center;
          img,
          span {
            width: 16px;
            height: 16px;
            margin-right: 12px;
          }
        }
      }
      .hr {
        height: 1px;
        background: rgba(0, 0, 0, 0.04);
        margin: 20px 0;
      }
    }
  }
}
</style>
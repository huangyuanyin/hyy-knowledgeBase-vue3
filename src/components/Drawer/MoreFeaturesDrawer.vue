<script lang="ts" setup>
import docSet from '@/assets/icons/drawer/docSet.svg'
import fullScreen from '@/assets/icons/drawer/fullScreen.svg'
import saveTem from '@/assets/icons/drawer/saveTem.svg'
import historyVersion from '@/assets/icons/drawer/historyVersion.svg'
import exportIcon from '@/assets/icons/drawer/export.svg'
import copyIcon from '@/assets/icons/drawer/copy.svg'
import moveIcon from '@/assets/icons/drawer/move.svg'
import deleteIcon from '@/assets/icons/drawer/delete.svg'
import operationIcon from '@/assets/icons/drawer/operation.svg'
import infoIcon from '@/assets/icons/drawer/info.svg'
import statisticIcon from '@/assets/icons/article/statistic.svg'
import arrowIcon from '@/assets/icons/drawer/arrow.svg'
import { ArticleInfo } from '@/type/article'

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

const infoStore = useInfoStore()
const drawerTab = ref('operation')
const operationItems = [
  { icon: docSet, text: '文档设置', type: 'label' },
  { type: 'hr' },
  { icon: fullScreen, text: '全屏', type: 'label' },
  { icon: saveTem, text: '另存为模板', type: 'label' },
  { icon: historyVersion, text: '另存为版本', type: 'label' },
  { icon: historyVersion, text: '查看已存版本', type: 'label' },
  { icon: exportIcon, text: '导出...', type: 'label' },
  { icon: copyIcon, text: '复制...', type: 'label' },
  { icon: moveIcon, text: '移动...', type: 'label' },
  { icon: deleteIcon, text: '删除...', type: 'label' }
]
const infoItems = ref<any>([
  { icon: '/src/assets/icons/drawer/count.svg', text: '字数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.counts} 字`, type: 'label' },
  { icon: historyVersion, text: '历史版本', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.versions_count} `, type: 'label' },
  { text: '创建时间', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.create_datetime}`, type: 'label' },
  { text: '更新时间', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.update_datetime}`, type: 'label' },
  { icon: '/src/assets/icons/drawer/author.svg', text: '作者', value: (infoStore.currentArticleInfo as ArticleInfo)?.creator_name, type: 'label' },
  { type: 'hr' },
  { icon: '/src/assets/icons/drawer/views.svg', text: '阅读数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.views} 次`, type: 'label' },
  { icon: '/src/assets/icons/drawer/comment.svg', text: '评论数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.comments_count} 条`, type: 'label' },
  { icon: '/src/assets/icons/drawer/like.svg', text: '点赞数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.likes_count} 次`, type: 'label' }
])
const isSaveTemplateDialog = ref(false)
const isSaveHistoryVersionDialog = ref(false)
const isHistoryVersionDialog = ref(false)

watchEffect(() => {
  props.drawer && (drawerTab.value = 'operation')
  infoItems.value = [
    { icon: '/src/assets/icons/drawer/count.svg', text: '字数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.counts} 字`, type: 'label' },
    { icon: historyVersion, text: '历史版本', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.versions_count} `, type: 'label' },
    { text: '创建时间', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.create_datetime}`, type: 'label' },
    { text: '更新时间', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.update_datetime}`, type: 'label' },
    { icon: '/src/assets/icons/drawer/author.svg', text: '作者', value: (infoStore.currentArticleInfo as ArticleInfo)?.creator_name, type: 'label' },
    { type: 'hr' },
    { icon: '/src/assets/icons/drawer/views.svg', text: '阅读数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.views} 次`, type: 'label' },
    { icon: '/src/assets/icons/drawer/comment.svg', text: '评论数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.comments_count} 条`, type: 'label' },
    { icon: '/src/assets/icons/drawer/like.svg', text: '点赞数', value: `${(infoStore.currentArticleInfo as ArticleInfo)?.likes_count} 次`, type: 'label' }
  ]
})

const handleClick = (tab) => {
  drawerTab.value = tab
}

const toHandle = (data) => {
  switch (data.text) {
    case '另存为模板':
      isSaveTemplateDialog.value = true
      break
    case '另存为版本':
      isSaveHistoryVersionDialog.value = true
      break
    case '查看已存版本':
      isHistoryVersionDialog.value = true
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}
</script>

<template>
  <el-drawer v-model="props.drawer" modal-class="MoreFeaturesDrawer_modal" custom-class="MoreFeaturesDrawer_wrap" :with-header="false" :modal="false" size="305px">
    <el-tabs class="drawerTab" v-model="drawerTab" @tab-change="handleClick">
      <el-tab-pane name="operation">
        <template #label>
          <img :src="operationIcon" alt="" />
        </template>
        <div class="operate-wrap">
          <div class="list">
            <template v-for="(item, _index) in operationItems" :key="'operationItems' + _index">
              <div v-if="item.type === 'label'" :class="['item', item.text === '删除...' ? 'delete' : '']" @click="toHandle(item)">
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
          <img :src="infoIcon" alt="" />
        </template>
        <div class="info-wrap">
          <template v-for="(item, _index) in infoItems" :key="'infoItems' + _index">
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
          <div class="hover:bg-#eff0f0" mt-20px flex justify-between items-center rounded-8px cursor-pointer bg="#fafafa" pt-16px pl-12px pr-12px pb-12px>
            <span w-24px h-28px><img w-24px h-24px :src="statisticIcon" alt="" /></span>
            <div mr-24px ml-12px flex-1 flex flex-col>
              <span text="#262626" text-14px>统计详情</span>
              <span text="#8a8f8d" text-12px>查看访问人员明细和更多分析</span>
            </div>
            <img w-24px h-28px :src="arrowIcon" alt="" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
  <SaveTemplateDialog :isShow="isSaveTemplateDialog" :parent="null" @closeDialog="isSaveTemplateDialog = false" :info="props.info" />
  <SaveHistoryVersionDialog :isShow="isSaveHistoryVersionDialog" @closeDialog="isSaveHistoryVersionDialog = false" :info="props.info" />
  <HistoryVersionDialog :isShow="isHistoryVersionDialog" @closeDialog="isHistoryVersionDialog = false" :info="props.info" />
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

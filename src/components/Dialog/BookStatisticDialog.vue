<script lang="ts" setup>
import { getOperationlogApi } from '@/api/log'
import rightArrowIcon from '@/assets/icons/rightArrow.svg'
import { ArticleInfo } from '@/type/article'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  deleteInfo: {
    type: Object as any,
    default: () => ({})
  },
  title: {
    type: String,
    default: '删除知识库'
  }
})
const emit = defineEmits(['closeDialog'])

const infoStore = useInfoStore()
const avatar = JSON.parse(localStorage.getItem('userInfo')).name
const visible = ref(false)
const isHistoryVersionDialog = ref(false)
const statistic = ref([
  {
    label: '字数',
    value: 0
  },
  {
    label: '历史版本',
    value: 0
  },
  {
    label: '更新时间',
    value: ''
  },
  {
    label: '创建时间',
    value: ''
  }
])
const edit = ref([
  {
    label: '创建者',
    value: ''
  },
  {
    label: '编辑者',
    value: ''
  }
])
const readData = ref([
  {
    label: '阅读数',
    value: 0
  },
  {
    label: '评论数',
    value: 0
  },
  {
    label: '点赞数',
    value: 0
  }
])
const memberList = ref([])

watch(
  () => props.isShow,
  (newVal: boolean) => {
    visible.value = newVal
    if (newVal) {
      statistic.value[0].value = (infoStore.currentArticleInfo as ArticleInfo).counts
      statistic.value[1].value = (infoStore.currentArticleInfo as ArticleInfo).versions_count || 0
      statistic.value[2].value = (infoStore.currentArticleInfo as ArticleInfo).update_datetime
      statistic.value[3].value = (infoStore.currentArticleInfo as ArticleInfo).create_datetime
      edit.value[0].value = (infoStore.currentArticleInfo as ArticleInfo).creator_name
      edit.value[1].value = avatar
      readData.value[0].value = (infoStore.currentArticleInfo as ArticleInfo).views
      readData.value[1].value = (infoStore.currentArticleInfo as ArticleInfo).comments_count
      readData.value[2].value = (infoStore.currentArticleInfo as ArticleInfo).likes_count
      getOperationlog()
    }
  }
)

const closeDialog = () => {
  visible.value = false
  emit('closeDialog', false)
}

const getOperationlog = async () => {
  const params = {
    request_path: `/articles/${(infoStore.currentArticleInfo as ArticleInfo).id}/`,
    request_method: 'GET'
  }
  const res = await getOperationlogApi(params)
  if (res.code === 1000) {
    memberList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const toClick = (item: any) => {
  if (item.label === '历史版本') {
    isHistoryVersionDialog.value = true
  }
}
</script>

<template>
  <el-dialog class="bookStatisticDialog" v-model="visible" width="720px" @close="closeDialog">
    <template #header>
      <div class="header">
        <h4>统计详情</h4>
      </div>
    </template>
    <div class="body">
      <div class="detail" flex>
        <div class="item" flex content-start flex-wrap p-8px rounded-8px mr-12px bg="#fafafa">
          <template v-for="(item, _index) in statistic" :key="'statistic' + _index">
            <div :class="['it', item.label === '历史版本' ? 'it-active' : '']" flex justify-between items-center rounded-8px pt-10px pb-10px pl-8px pr-8px @click="toClick(item)">
              <div flex flex-col>
                <span text-14px font-weight-500 font-family-PingFangSC-Medium sans-serif text="#262626" line-height-20px>{{ item.value }}</span>
                <span text-12px mt-2px text="#8a8f8d" line-height-17px>{{ item.label }}</span>
              </div>
              <span v-if="item.label === '历史版本'" flex items-center justify-between><img :src="rightArrowIcon" alt="" /></span>
            </div>
          </template>
        </div>
        <div class="item" flex flex-col p-8px rounded-8px mr-12px bg="#fafafa">
          <div flex flex-col justify-between items-start rounded-8px pt-10px pb-10px pl-8px pr-8px v-for="(item, index) in edit" :key="'edit' + index">
            <span text-14px font-weight-500 font-family-PingFangSC-Medium sans-serif text="#262626" line-height-20px>{{ item.value }}</span>
            <span text-12px mt-2px text="#8a8f8d" line-height-17px>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <h4 mt-20px mb-10px text-16px text="#262626" line-height-24px>阅读数据</h4>
      <div flex>
        <div
          flex-1
          flex
          flex-col
          pt-8px
          pb-8px
          pr-12px
          pl-12px
          rounded-8px
          mr-12px
          border="1px solid transparent"
          bg="#fafafa"
          v-for="(item, index) in readData"
          :key="'readData' + index"
        >
          <span text-20px text="#262626" line-height-28px>{{ item.value }}</span>
          <span text-12px text="#8a8f8d" line-height-17px>{{ item.label }}</span>
        </div>
      </div>
      <div flex items-center justify-between mt-20px mb-10px>
        <h4 text-16px text="#262626">访问人员</h4>
        <span text-12px line-height-17px text="#262626" mr-2px ml-2px cursor-pointer>下载明细</span>
      </div>
      <div flex flex-col pt-6px pb-6px pl-14px pr-14px mt-6px rounded-8px h-216px overflow-auto bg="#fafafa">
        <div class="member-item" min-h-40px flex items-center justify-between mr-24px v-for="(item, index) in memberList" :key="'memberList' + index">
          <div flex>
            <img w-20px h-20px :src="item.avatar" alt="" />
            <span text-14px ml-8px mr-8px text="#262626">{{ item.creator_name }}</span>
          </div>
          <span text-14px text="#262626">{{ item.create_datetime }}</span>
        </div>
      </div>
    </div>
  </el-dialog>

  <HistoryVersionDialog :isShow="isHistoryVersionDialog" @closeDialog="isHistoryVersionDialog = false" :info="(infoStore.currentArticleInfo as ArticleInfo)" />
</template>

<style lang="scss">
.bookStatisticDialog {
  border-radius: 8px;
  .el-dialog__header {
    border-bottom: none !important;
  }
  .header {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .body {
    font-size: 14px;
    box-sizing: border-box;
    .detail {
      .item {
        width: calc(50% - 6px);
        .it {
          flex-basis: 50%;
        }
        .it-active {
          &:hover {
            cursor: pointer;
            background-color: #eff0f0;
          }
        }
      }
    }
    .member-item {
      width: calc(50% - 12px);
    }
  }
}
</style>

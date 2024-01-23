<script lang="ts" setup>
import { BookStatisticsInfo, TeamStatisticsInfo } from '@/type/info'

const props = defineProps({
  info: {
    type: Object as PropType<BookStatisticsInfo | TeamStatisticsInfo>,
    default: () => ({})
  }
})

const statisticsList = ref([
  {
    title: '知识财富',
    counts: 0,
    children: [
      { label: '文档', value: 0 },
      { label: '表格', value: 0 },
      { label: '思维导图', value: 0 },
      { label: '幻灯片', value: 0 },
      { label: '文件', value: 0 }
    ]
  },
  {
    title: '知识协同',
    counts: 0,
    children: [
      { label: '编辑', value: 0 },
      { label: '阅读', value: 0 },
      { label: '评论', value: 0 },
      { label: '点赞', value: 0 },
      { label: '收藏', value: 0 }
    ]
  }
])

watch(
  () => props.info,
  (val) => {
    if (val) {
      statisticsList.value[0].counts = val.content_count
      statisticsList.value[0].children[0].value = val.doc_count
      statisticsList.value[0].children[1].value = val.sheet_count
      statisticsList.value[0].children[2].value = val.mind_count
      statisticsList.value[0].children[3].value = val.ppt_count
      statisticsList.value[0].children[4].value = val.file_count
      statisticsList.value[1].counts = val.knowledge_cooperate_count || 0
      statisticsList.value[1].children[0].value = val.write_count
      statisticsList.value[1].children[1].value = val.read_count
      statisticsList.value[1].children[2].value = val.comment_count
      statisticsList.value[1].children[3].value = val.like_count
      statisticsList.value[1].children[4].value = val.collect_count || 0
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="StatisticsCard_wrap" flex mb-24px pr-12px>
    <div
      class="flex-0 flex-shrink-0 w-1/2"
      :class="['table', item.title === '知识财富' ? 'wealth' : 'cooperate']"
      mr-12px
      pt-16px
      pr-16px
      pl-16px
      text="#fff"
      rounded-8px
      bg-no-repeat
      v-for="(item, index) in statisticsList"
      :key="'statisticsList' + index"
    >
      <div>
        <span text-40px text="#fff" line-height-48px>{{ item.counts === 0 ? '--' : item.counts }}</span>
        <p text-14px text-white-85 line-height-22px mt-8px>份{{ item.title }}</p>
      </div>
      <div flex items-center>
        <div class="counts" flex flex-1 text-14px mt-16px mb-12px v-for="(it, index) in item.children" :key="'children' + index">
          <div flex flex-col>
            <span text="#ffffffa6">{{ it.label }}</span>
            <span text-14px text="#fff" line-height-22px font-700>{{ it.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.StatisticsCard_wrap {
  .table {
    background-position: top 24px right 24px, 50%;
    .counts {
      &::before {
        content: ' ';
        display: block;
        width: 1px;
        margin-top: 8px;
        background: hsla(0, 0%, 100%, 0.08);
        height: 24px;
        margin-right: 14px;
      }
      &:first-child::before {
        display: none;
      }
    }
  }
  .wealth {
    background-color: #626c8a;
    background-image: url(https://gw.alipayobjects.com/zos/basement_prod/76523cee-d460-4960-8b73-50c79042b9de.svg), linear-gradient(#626c8a, #333a52);
  }
  .cooperate {
    background-color: #2f8ef4;
    background-image: url(https://gw.alipayobjects.com/zos/basement_prod/94072183-916e-4dbf-b328-aea3d8988949.svg);
  }
}
</style>

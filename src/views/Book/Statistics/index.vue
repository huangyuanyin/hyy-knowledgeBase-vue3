<script lang="ts" setup>
import likeIcon from '@/assets/icons/bookSetting/like.svg'
import { getBookStatisticApi } from '@/api/statistic'
import { BookStatisticsInfo } from '@/type/info'

const infoStore = useInfoStore()
const bookStatistic = ref<BookStatisticsInfo>({} as BookStatisticsInfo)

const { articleList, getDocList } = useArticle()

const getBookStatistic = async () => {
  let res = await getBookStatisticApi(infoStore.currentQuery.lid)
  if (res.code === 1000) {
    bookStatistic.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getBookStatistic()
  await getDocList(infoStore.currentQuery.lid)
  console.log(`output->`, articleList.value)
})
</script>

<template>
  <div class="Statistics_wrap" max-w-1080px m-auto>
    <div class="header" mb-28px>
      <span font-700 text-20px text="rgba(0, 0, 0, 0.85)">统计</span>
      <p text-14px mt-6px text="#8a8f8d">01-18,2024（实时更新当日数据，“--”表示暂无数据）</p>
    </div>
    <StatisticsCard :info="bookStatistic" />
    <div mb-12px p-16px rounded-8px border="1px solid #0000000A" bg="#fafafa" flex justify-between h-122px>
      <div w-226px>
        <p text-14px color="#262626" line-height-22px flex>
          <span flex items-center justify-center mr-8px><img w-20px h-20px :src="likeIcon" alt="" /></span>点赞数
          <span text-14px line-height-22px ml-12px text="#8a8f8d">暂无知识库排名</span>
        </p>
        <span block mt-14px text-40px line-height-48px font-700>{{ bookStatistic.like_count }}</span>
      </div>
      <img w-96px h-96px src="https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*iZBXTa0WZFUAAAAAAAAAAAAADvuFAQ/original" alt="" />
    </div>
    <StatisticsTable :tableData="articleList" />
  </div>
</template>

<style lang="scss" scoped>
.Statistics_wrap {
}
</style>

<script lang="ts" setup>
import bookIcon from '@/assets/icons/teamSetting/book.svg'
import { getTeamArticleStatisticApi, getTeamBookStatisticApi, getTeamMemberStatisticApi, getTeamStatisticApi } from '@/api/statistic'
import { TeamStatisticsInfo } from '@/type/info'

const infoStore = useInfoStore()
const teamStatistic = ref<TeamStatisticsInfo>({} as TeamStatisticsInfo)
const teamMemberStatistic = ref([])
const teamArticleStatistic = ref([])
const teamBookStatistic = ref([])
const teamTableData = ref([])
const book = ref([
  {
    label: '知识库种类',
    children: [
      { label: '文档知识库：', value: 0 },
      { label: '文件库：', value: 0 }
    ]
  },
  {
    label: '知识库公开性：',
    children: [
      { label: '公开知识库：', value: 0 },
      { label: '私密知识库：', value: 0 }
    ]
  }
])

const getTeamStatistic = async () => {
  let res = await getTeamStatisticApi(infoStore.currentQuery.gid)
  if (res.code === 1000) {
    teamStatistic.value = res.data
    book.value[0].children[0].value = res.data.book_count
    book.value[0].children[1].value = res.data.file_count || '--'
    book.value[1].children[0].value = res.data.public_book_count
    book.value[1].children[1].value = res.data.private_book_count
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamMemberStatistic = async () => {
  let res = await getTeamMemberStatisticApi(infoStore.currentQuery.gid)
  if (res.code === 1000) {
    teamMemberStatistic.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamBookStatistic = async () => {
  let res = await getTeamBookStatisticApi(infoStore.currentQuery.gid)
  if (res.code === 1000) {
    teamBookStatistic.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamArticleStatistic = async () => {
  let res = await getTeamArticleStatisticApi(infoStore.currentQuery.gid)
  if (res.code === 1000) {
    teamArticleStatistic.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const changeTab = (val: string) => {
  switch (val) {
    case 'memberCol':
      teamTableData.value = teamMemberStatistic.value
      break
    case 'bookCol':
      teamTableData.value = teamBookStatistic.value
      break
    case 'docCol':
      teamTableData.value = teamArticleStatistic.value
      break
  }
}

onMounted(async () => {
  await getTeamStatistic()
  await getTeamMemberStatistic()
  await getTeamBookStatistic()
  await getTeamArticleStatistic()
  teamTableData.value = teamMemberStatistic.value
})
</script>

<template>
  <div class="Statistics_wrap" max-w-1080px m-auto>
    <div class="header" mb-28px>
      <span font-700 text-20px text="rgba(0, 0, 0, 0.85)">统计</span>
      <p text-14px mt-6px text="#8a8f8d">{{ new Date().toLocaleDateString() }}（实时更新当日数据，“--”表示暂无数据）</p>
    </div>
    <StatisticsCard :info="teamStatistic" />
    <div mb-12px p-16px rounded-8px border="1px solid #0000000A" bg="#fafafa" flex h-122px>
      <div w-226px>
        <p text-14px color="#262626" line-height-22px flex>
          <span flex items-center justify-center mr-8px><img w-20px h-20px :src="bookIcon" alt="" /></span>知识库
        </p>
        <span block mt-14px text-40px line-height-48px font-700>{{ teamStatistic.book_count }}</span>
      </div>
      <div flex-1 pt-9px pb-13px border-l="1px solid #e7e9e8">
        <div mb-24px ml-32px flex v-for="(item, index) in book" :key="'book' + index">
          <div flex text="#585a5a" w-148px mr-32px border-r="1px sold #0000000A " v-for="(it, index) in item.children" :key="'item' + index">
            <span text-14px line-height-22px>{{ it.label }}</span>
            <span flex-1 text-14px text="#262626" line-height-22px>{{ it.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <StatisticsTable :table-data="teamTableData" @changeTab="changeTab" />
  </div>
</template>

<style lang="scss" scoped>
.Statistics_wrap {
}
</style>

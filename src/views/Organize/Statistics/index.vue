<script lang="ts" setup>
import likeIcon from '@/assets/icons/bookSetting/like.svg'
import { getSpaceMemberStatisticApi, getSpaceStatisticApi, getSpaceTeamStatisticApi } from '@/api/statistic'
import { SpaceStatisticsInfo } from '@/type/info'

const infoStore = useInfoStore()
const spaceStatistic = ref<SpaceStatisticsInfo>({} as SpaceStatisticsInfo)
const memberListStatistic = ref([])
const teamListStatistic = ref([])
const tableData = ref([])
const searchName = ref('')
const currentPage = ref(1)
const total = ref(0)
const range = ref(0)

const getSpaceStatistic = async () => {
  let res = await getSpaceStatisticApi(infoStore.currentQuery.sid)
  if (res.code === 1000) {
    spaceStatistic.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpaceMemberStatistic = async () => {
  const params = {
    name: searchName.value,
    range: range.value,
    page: currentPage.value,
    pagesize: 10
  }
  const res = await getSpaceMemberStatisticApi(infoStore.currentQuery.sid, params)
  if (res.code === 1000) {
    memberListStatistic.value = res.data as any
    tableData.value = memberListStatistic.value
    total.value = res.total
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpaceTeamStatistic = async () => {
  const params = {
    name: searchName.value,
    range: range.value,
    page: currentPage.value,
    pagesize: 10
  }
  const res = await getSpaceTeamStatisticApi(infoStore.currentQuery.sid, params)
  if (res.code === 1000) {
    teamListStatistic.value = res.data as any
    tableData.value = teamListStatistic.value
    total.value = res.total
  } else {
    ElMessage.error(res.msg)
  }
}

const changeTab = (val: string) => {
  searchName.value = ''
  currentPage.value = 1
  range.value = 0
  switch (val) {
    case 'memberCol':
      getSpaceMemberStatistic()
      break
    case 'teamCol':
      getSpaceTeamStatistic()
      break
  }
}

const toSearch = (val) => {
  searchName.value = val[1]
  currentPage.value = 1
  range.value = val[2] || 0
  switch (val[0]) {
    case 'memberCol':
      getSpaceMemberStatistic()
      break
    case 'teamCol':
      getSpaceTeamStatistic()
      break
  }
}

const changePage = (val) => {
  currentPage.value = val[1]
  switch (val[0]) {
    case 'memberCol':
      getSpaceMemberStatistic()
      break
    case 'teamCol':
      getSpaceTeamStatistic()
      break
  }
}

onMounted(async () => {
  await getSpaceStatistic()
  await getSpaceMemberStatistic()
  tableData.value = memberListStatistic.value
})
</script>

<template>
  <div class="Statistics_wrap" max-w-1080px m-auto>
    <div class="header" mb-28px>
      <span font-700 text-20px text="rgba(0, 0, 0, 0.85)">统计</span>
      <p text-14px mt-6px text="#8a8f8d">{{ new Date().toLocaleDateString() }}（实时更新当日数据，“--”表示暂无数据）</p>
    </div>
    <StatisticsCard :info="spaceStatistic" />
    <div mb-12px p-16px rounded-8px border="1px solid #0000000A" bg="#fafafa" flex justify-between h-122px>
      <div w-226px>
        <p text-14px color="#262626" line-height-22px flex>
          <span flex items-center justify-center mr-8px><img w-20px h-20px :src="likeIcon" alt="" /></span>点赞数
          <span text-14px line-height-22px ml-12px text="#8a8f8d">暂无知识库排名</span>
        </p>
        <span block mt-14px text-40px line-height-48px font-700>{{ spaceStatistic.like_count }}</span>
      </div>
      <img w-96px h-96px src="https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*iZBXTa0WZFUAAAAAAAAAAAAADvuFAQ/original" alt="" />
    </div>
    <StatisticsTable :total="total" :tableData="tableData" @changeTab="changeTab" @toSearch="toSearch" @changePage="changePage" />
  </div>
</template>

<style lang="scss" scoped>
.Statistics_wrap {
}
</style>

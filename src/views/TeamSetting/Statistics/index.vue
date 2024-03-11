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
const name = ref('')
const range = ref(0)
const total = ref(0)
const currentPage = ref(1)
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

const handleApi = async (val) => {
  switch (val) {
    case 'memberCol':
      await getTeamMemberStatistic()
      teamTableData.value = teamMemberStatistic.value
      break
    case 'bookCol':
      await getTeamBookStatistic()
      teamTableData.value = teamBookStatistic.value
      break
    case 'docCol':
      await getTeamArticleStatistic()
      teamTableData.value = teamArticleStatistic.value
      break
    default:
      break
  }
}

const toSearch = async (val) => {
  currentPage.value = 1
  name.value = val[1]
  range.value = val[2] || 0
  handleApi(val[0])
}

const changePage = (val) => {
  currentPage.value = val[1]
  handleApi(val[0])
}

const getTeamStatistic = async () => {
  let res: any = await getTeamStatisticApi(infoStore.currentQuery.gid)
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
  const parmas = {
    name: name.value,
    range: range.value,
    page: currentPage.value,
    pagesize: 10
  }
  let res: any = await getTeamMemberStatisticApi(infoStore.currentQuery.gid, parmas)
  if (res.code === 1000) {
    teamMemberStatistic.value = res.data
    total.value = res.total
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamBookStatistic = async () => {
  const parmas = {
    name: name.value,
    range: range.value,
    page: currentPage.value,
    pagesize: 10
  }
  let res: any = await getTeamBookStatisticApi(infoStore.currentQuery.gid, parmas)
  if (res.code === 1000) {
    teamBookStatistic.value = res.data
    total.value = res.total
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamArticleStatistic = async () => {
  const parmas = {
    title: name.value,
    range: range.value,
    page: currentPage.value,
    pagesize: 10
  }
  let res: any = await getTeamArticleStatisticApi(infoStore.currentQuery.gid, parmas)
  if (res.code === 1000) {
    teamArticleStatistic.value = res.data
    total.value = res.total
  } else {
    ElMessage.error(res.msg)
  }
}

const changeTab = async (val: string) => {
  range.value = 0
  currentPage.value = 1
  name.value = ''
  switch (val) {
    case 'memberCol':
      await getTeamMemberStatistic()
      teamTableData.value = teamMemberStatistic.value
      break
    case 'bookCol':
      await getTeamBookStatistic()
      teamTableData.value = teamBookStatistic.value
      break
    case 'docCol':
      await getTeamArticleStatistic()
      teamTableData.value = teamArticleStatistic.value
      break
    default:
      break
  }
}

onMounted(async () => {
  await getTeamStatistic()
  await getTeamMemberStatistic()
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
    <StatisticsTable :total="total" :table-data="teamTableData" @toSearch="toSearch" @changePage="changePage" @changeTab="changeTab" />
  </div>
</template>

<style lang="scss" scoped>
.Statistics_wrap {
}
</style>

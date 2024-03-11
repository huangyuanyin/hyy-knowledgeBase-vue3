<script lang="ts" setup>
import { getSearchApi } from '@/api/mine'
import arrowDownIcon2 from '@/assets/icons/arrowDownIcon2.svg'
import goIcon from '@/assets/icons/goIcon.svg'
import searchImg from '@/assets/img/search.png'

const route = useRoute()
const infoStore = useInfoStore()
const isTip = ref(false)
const loading = ref(false)
const value = ref('')
const list = ref([])
const spaceRange = ref([
  { name: '全部空间', value: '0', type: 'organization' },
  { name: '当前空间', value: '', type: 'organization' }
])
const scope = ref('')
const scope_id = ref('')
const sub_type = ref('')
const time_horizon = ref('')
const subTypeList = [
  { name: '全部', value: "['all']" },
  { name: '文档', value: "['doc']" },
  { name: '表格', value: "['sheet']" },
  { name: '脑图', value: "['mind']" },
  { name: '幻灯片', value: "['ppt']" },
  { name: '文件', value: "['file']" }
]
const timeList = [
  {
    name: '时间不限',
    value: ''
  },
  {
    name: '24小时内',
    value: '1'
  },
  {
    name: '7天内',
    value: '7'
  },
  {
    name: '30天内',
    value: '30'
  },
  {
    name: '半年内',
    value: '180'
  }
]

watch(
  () => route.fullPath,
  (newVal: string) => {
    if (newVal && route.meta.title === '搜索') {
      initData()
    }
  }
)

watch(
  () => value.value,
  (newVal: string) => {
    isTip.value = false
    if (newVal === '') {
      isTip.value = true
    }
  }
)

onMounted(() => {
  initData()
})

function initData() {
  console.log(`output->inf`, infoStore.currentQuery)
  value.value = (infoStore.currentQuery?.q as string) || ''
  time_horizon.value = ''
  scope.value = (infoStore.currentQuery?.scope as string) || ''
  scope_id.value = (infoStore.currentQuery?.scope_id as string) || ''
  sub_type.value = "['all']"
  spaceRange.value[1].value = infoStore.currentQuery?.sid
  if (infoStore.currentQuery?.scope !== 'organization')
    spaceRange.value.push({
      name: infoStore.currentQuery?.scope_name,
      value: infoStore.currentQuery?.scope_id,
      type: infoStore.currentQuery?.scope
    })
  getSearch()
}

function getTimeLabel() {
  const selectedTime = timeList.find((item) => item.value === time_horizon.value)
  return selectedTime?.name === '时间不限' ? '更新时间' : selectedTime?.name
}

function getSubTypeName() {
  const selectedSubType = subTypeList.find((item) => item.value === sub_type.value)
  return selectedSubType?.name
}

function judegeArticleType(type: string) {
  return useData().judegeArticleType(type)
}

function highlightKeywords(text, keyword) {
  if (!keyword) {
    return text
  }
  const regex = new RegExp(keyword, 'gi')
  return text.replace(regex, (match) => `<em text="#df2a3f">${match}</em>`)
}

const handleTime = (val) => {
  time_horizon.value = val
  getSearch()
}

const handleSpace = (val) => {
  scope.value = val.type
  scope_id.value = val.value
  list.value = []
  getSearch()
}

const handleSubType = (val) => {
  sub_type.value = val
  getSearch()
}

const getSearch = async () => {
  if (value.value === '') return
  const params = {
    page: '1',
    q: value.value,
    type: 'content',
    scope: scope.value,
    scope_id: scope_id.value,
    sub_type: sub_type.value,
    time_horizon: time_horizon.value
  }
  scope_id.value === '0' && delete params.scope_id && (params.scope = 'all')
  time_horizon.value === '' && delete params.time_horizon
  loading.value = true
  let res = await getSearchApi(params)
  loading.value = false
  if (res.code === 1000) {
    list.value = res.data as any
  } else {
    ElMessage.error(res.msg)
    list.value = []
  }
}

const toLink = (item) => {
  const baseUrl = import.meta.env.MODE === 'development' ? window.location.origin : import.meta.env.VITE_URL
  window.open(
    `${baseUrl}${infoStore.currentSpaceType === '个人' ? '' : `/#/${infoStore.currentSpaceInfo.spacekey}`}/directory/${item.type}?sid=${item.space}&sname=${item.space_name}&gid=${
      item.group
    }&gname=${item.group_name}&lid=${item.book}&lname=${item.book_name}&aid=${item.id}&aname=${item.title}`
  )
}
</script>

<template>
  <div class="Search_wrap">
    <el-popover popper-class="searchPopver" placement="bottom" :width="400" trigger="hover" :show-arrow="false" :teleported="false">
      <template #reference>
        <el-input v-model="value" class="rounded-6px mb-12px w-380px!" placeholder="搜索" clearable @blur="getSearch">
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
      </template>
      <ul v-if="value">
        <li
          flex
          justify-between
          items-center
          pt-12px
          pb-12px
          pr-32px
          pl-32px
          box-border
          :class="[scope_id === item.value ? 'bg-#eff0f0' : '']"
          hover="bg-#eff0f0"
          cursor-pointer
          v-for="(item, index) in spaceRange"
          :key="'spaceRange' + index"
          @click="handleSpace(item)"
        >
          <span text="14px #262626">{{ value }}</span>
          <span text="14px #8a8f8d">{{ item.name }}</span>
        </li>
      </ul>
      <p v-else pt-12px pb-12px pr-32px pl-32px>请输入搜索内容</p>
    </el-popover>
    <template v-if="!isTip">
      <div class="module_header" mt-10px flex items-center justify-between>
        <div flex items-center>
          <div
            h-32px
            flex
            items-center
            mr-10px
            ml-10px
            text-14px
            text="#262626"
            cursor-pointer
            box-border
            hover="bg-#eff0f0  font-600"
            rounded-6px
            :class="[scope_id === item.value ? 'bg-#eff0f0  font-600' : '']"
            v-for="(item, index) in spaceRange"
            :key="'spaceRange' + index"
            @click="handleSpace(item)"
          >
            <span pr-16px pl-16px>{{ item.name }}</span>
          </div>
        </div>
        <div flex items-center>
          <el-dropdown trigger="click" @command="handleSubType">
            <span flex items-center ml-18px cursor-pointer text-14px text="#262626">
              {{ getSubTypeName() }}
              <img ml-2px :src="arrowDownIcon2" alt="" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :bg="sub_type === item.value ? '#eff0f0 ' : ''" v-for="(item, index) in subTypeList" :key="'subTypeList' + index" :command="item.value">
                  <span flex items-center justify-center mr-8px w-16px text="#585a5a" text-14px>
                    <img w-14px h-14px :src="goIcon" alt="" v-if="sub_type === item.value" />
                  </span>
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- <span flex items-center ml-18px cursor-pointer text-14px text="#262626">
            创建者
            <img ml-2px :src="arrowDownIcon2" alt="" />
          </span> -->
          <el-dropdown trigger="click" @command="handleTime">
            <span flex items-center ml-18px cursor-pointer text-14px text="#262626">
              {{ getTimeLabel() }}
              <img ml-2px :src="arrowDownIcon2" alt="" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :bg="time_horizon === item.value ? '#eff0f0 ' : ''" v-for="(item, index) in timeList" :key="'timeList' + index" :command="item.value">
                  <span flex items-center justify-center mr-8px w-16px text="#585a5a" text-14px>
                    <img w-14px h-14px :src="goIcon" alt="" v-if="time_horizon === item.value" />
                  </span>
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <p mt-20px mb-8px text-14px text="#585a5a" line-20px>
        相关内容
        <span text-12px text="#8a8f8d" ml-6px>为你找到约 {{ list.length }} 个结果</span>
      </p>
      <template v-if="list.length && !loading">
        <div flex items-start flex-col v-for="(item, index) in list" :key="'list' + index">
          <div w-full flex items-start pt-20px pb-20px box-border border-b border-solid border="#0000000f">
            <span>
              <img w-26px h-26px mr-14px :src="judegeArticleType(item.type)" alt="" />
            </span>
            <div flex flex-col items-start>
              <span line-22px text="16px #262626" mb-8px cursor-pointer @click="toLink(item)">{{ item.title }}</span>
              <p v-html="highlightKeywords(item.abstract, value)" text="14px #262626" mb-8px></p>
              <p text="12px #8a8f8d" line-18px>
                {{ item.book_name }}<span ml-12px>{{ item.update_datetime }}</span>
              </p>
            </div>
          </div>
        </div>
      </template>
      <div v-if="!list.length && !loading" p-40px>
        <div h-66px mt-60px mb-30px flex items-center w-full justify-center>
          <img w-98px h-66px :src="searchImg" alt="" />
        </div>
        <div text="#8a8f8d 14px" flex items-center flex-col>
          <p mb-10px>无搜索结果</p>
          <p>试试更换搜索范围，或更改查询词</p>
        </div>
      </div>
      <Loading v-if="loading" text="数据量较大，正在努力搜索中..." height="70vh" />
    </template>
    <template v-else>
      <p text="#262626 14px" line-22px mt-12px>使用上方搜索框，开始搜索吧</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.Search_wrap {
  :deep(.el-input__wrapper) {
    border-radius: 6px !important;
    border: 1px solid #d9d9d9;
    box-shadow: none;
    height: 40px;
    width: 380px;

    &:hover {
      border-color: #0bd07d !important;
    }
  }
  :deep(.el-dropdown-menu__item) {
    background: #eff0f0 !important;
  }
  :deep(.searchPopver) {
    border-radius: 8px !important;
    padding: 4px 0px !important;
  }
}
</style>

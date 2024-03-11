<script lang="ts" setup>
import searchIcon from '@/assets/icons/searchIcon.svg'
import publicAreaIcon from '@/assets/icons/publicAreaIcon.svg'
import arrowIcon from '@/assets/icons/arrowIcon.svg'
import enterIcon from '@/assets/icons/enterIcon.svg'
import publicIcon from '@/assets/icons/library/publicIcon.svg'
import { useBook } from '@/hooks/useBook'
import { useTeam } from '@/hooks/useTeam'
import { useData } from '@/hooks/useData'
import SparkMD5 from 'spark-md5'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const visible = ref<boolean>(false)
const value = ref<string>('')
const selectId = ref<string>('')
const selectedIndex = ref(0)
const listContainer = ref<HTMLElement | null>(null)
const list = ref<any[]>([
  {
    label: '搜索范围：空间',
    children: [
      {
        id: null,
        name: '当前空间',
        type: 'organization',
        icon: infoStore.currentSpaceInfo.icon || 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('personalSpaceInfo')).icon
      },
      {
        id: 0,
        name: '全部空间',
        type: 'organization',
        icon: publicAreaIcon
      }
    ]
  },
  {
    label: '搜索范围：知识库',
    children: []
  },
  {
    label: '搜索范围：团队',
    children: []
  }
])

watch(
  () => props.show,
  (newVal: boolean) => {
    visible.value = newVal
    if (newVal) {
      value.value = ''
      list.value[0].children[0].id = infoStore.currentSpaceInfo.id || JSON.parse(localStorage.getItem('personalSpaceInfo')).id
      const { spaceIcon } = useData()
      if (route.path.includes('/search')) {
        value.value = infoStore.currentQuery.q ? (infoStore.currentQuery.q as string) : ''
        selectId.value = `${infoStore.currentQuery.scope_id}${infoStore.currentQuery.scope_name}`
      } else {
        selectId.value = String(infoStore.currentSpaceInfo.id || JSON.parse(localStorage.getItem('personalSpaceInfo')).id) + list.value[0].children[0].name
      }
      handleBookList()
      if (infoStore.currentSpaceType === '组织') {
        handleTeamList()
      } else {
        list.value[0].children[0].id = infoStore.currentQuery?.sid
        list.value[0].children[0].icon = spaceIcon.value
      }
      if (infoStore.currentSpaceType === '个人') list.value.pop()
    }
  }
)

async function handleBookList() {
  const { bookList, getBookList } = useBook()
  const { user } = await useData()
  await getBookList({ space: infoStore.currentQuery?.sid, permusername: user.value })
  list.value[1].children = bookList.value
}

async function handleTeamList() {
  const { teamList, getTeamList } = useTeam()
  await getTeamList()
  list.value[2].children = teamList.value.map((item) => {
    const { groupname, ...rest } = item
    return { ...rest, name: groupname }
  })
}

function isItemSelected(item) {
  return selectId.value === item.id + item.name
}

function moveSelection(offset) {
  const maxIndex = list.value.flatMap((item) => item.children).length - 1
  selectedIndex.value = selectedIndex.value + offset
  if (selectedIndex.value > maxIndex) {
    selectedIndex.value = 0
  } else if (selectedIndex.value < 0) {
    selectedIndex.value = maxIndex
  }
  if (maxIndex)
    list.value
      .flatMap((item) => item.children)
      .map((item, index) => {
        if (selectedIndex.value === index) {
          selectId.value = item.id + item.name
        }
      })
}

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':
      moveSelection(-1)
      break
    case 'ArrowDown':
      moveSelection(1)
      break
    case 'Enter':
      toAddArticle(list.value.flatMap((item) => item.children)[selectedIndex.value])
      break
  }
}

function navigateToSearch(type, val) {
  if (infoStore.currentSidebar === 'DirectorySidebar') {
    const query = {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname,
      scope: type,
      scope_id: val.id,
      scope_name: val.name,
      q: value.value
    }
    const baseUrl = import.meta.env.MODE === 'development' ? window.location.origin : import.meta.env.VITE_URL
    window.open(
      `${baseUrl}${infoStore.currentSpaceType === '个人' ? '' : `/#/${infoStore.currentSpaceInfo.spacekey}`}/search?sid=${query.sid}&sname=${query.sname}&scope=${
        query.scope
      }&scope_id=${query.scope_id}&scope_name=${query.scope_name}&q=${query.q}`
    )
  } else {
    router.push({
      path: `${infoStore.currentSpaceType === '个人' ? '' : `/${infoStore.currentSpaceInfo.spacekey}`}/search`,
      query: {
        sid: infoStore.currentQuery.sid,
        sname: infoStore.currentQuery.sname,
        scope: type,
        scope_id: val.id,
        scope_name: val.name,
        q: value.value
      }
    })
  }
}

const toAddArticle = (val) => {
  if (value.value === '') return ElMessage.error('搜索内容不能为空')
  if (val.type === 'organization') {
    navigateToSearch('organization', val)
  } else if (val.type === 'book') {
    navigateToSearch('book', val)
  } else {
    navigateToSearch('group', val)
  }
  closeDialog()
}

const closeDialog = () => {
  visible.value = false
  emit('closeDialog', false)
}

onMounted(() => {
  props.show && document.addEventListener('keydown', handleKeyPress)
})

onBeforeMount(() => {
  !props.show && document.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <el-dialog class="SearchDialog" v-model="visible" width="720px" @close="closeDialog" :show-close="false">
    <template #header>
      <div class="header" p-10px text-16px line-24px flex="~" items-center justify-between box-border>
        <div flex="~" items-center flex-1>
          <span flex="~" items-center w-34px h-24px mr-4px>
            <img w-18px h-18px :src="searchIcon" alt="" />
          </span>
          <el-input v-model="value" placeholder="搜索内容" clearable></el-input>
        </div>
        <span class="text-#bec0bf text-14px flex items-center ml-4" v-if="!value">
          <span flex="~" items-center justify-center w-18px h-18px mr-8px border="1 solid #e7e9e8" rounded-4px bg="#fafafa">
            <img w-14px h-14px :src="arrowIcon" alt="" />
          </span>
          <span flex="~" items-center justify-center w-18px h-18px mr-8px border="1 solid #e7e9e8" rounded-4px bg="#fafafa">
            <img w-14px h-14px :src="arrowIcon" alt="" rotate-180 />
          </span>
          <span>切换搜索范围</span>
        </span>
      </div>
    </template>
    <ul ref="listContainer" max-h-690px overflow-y-auto>
      <div border="t-1 solid #0000000a" v-for="(item, index) in list" :key="'list' + index">
        <div class="m-4px mr-16px p-5px pl-8px line-22px flex text-#bec0bf text-14px">{{ item.label }}</div>
        <li
          v-for="(it, index) in item.children"
          :key="'it' + index"
          line-22px
          m-4px
          mr-8px
          p-6px
          pr-8px
          pl-8px
          cursor-pointer
          flex="~"
          items-center
          justify-between
          rounded-6px
          hover="bg-#eff0f0"
          box-border
          @click="toAddArticle(it)"
          :class="{
            'bg-#eff0f0': isItemSelected(it)
          }"
        >
          <div flex items-center>
            <img v-if="it.name !== '公共区'" w-18px h-18px mr-10px :src="it.icon" alt="" />
            <img v-else w-18px h-18px mr-10px :src="publicIcon" alt="" />
            {{ it.name }}
          </div>
          <span text="#8a8f8d" text-14px flex items-center v-if="isItemSelected(it)">
            <span flex items-center justify-center w-18px h-18px mr-8px border="1 solid #e7e9e8" rounded-4px bg="#fafafa">
              <img :src="enterIcon" alt="" />
            </span>
            跳转
          </span>
        </li>
      </div>
    </ul>
  </el-dialog>
</template>

<style lang="scss">
.SearchDialog {
  border-radius: 8px;
  padding: 0px;
  box-sizing: border-box;
  .el-dialog__body {
    padding: 0px !important;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .header {
    .el-input__wrapper {
      box-shadow: none;
      padding: 0px;
      input {
        font-size: 14px;
        height: 34px;
      }
    }
  }
}
</style>

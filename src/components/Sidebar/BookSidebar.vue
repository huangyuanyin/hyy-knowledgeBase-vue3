<script lang="ts" setup>
import { getLibraryDetailApi } from '@/api/library'

const menuList = [
  {
    label: '设置',
    children: [
      { label: '知识库信息', nickName: 'basic', icon: '/src/assets/icons/teamSetting/teamInfo.svg', path: '/bookSetting/basic' },
      { label: '权限', nickName: 'collaborators', icon: '/src/assets/icons/teamSetting/permissions.svg', path: '/bookSetting/collaborators' },
      { label: '更多设置', nickName: 'settings', icon: '/src/assets/icons/teamSetting/set.svg', path: '/bookSetting/settings' }
    ]
  },
  {
    label: '高级设置',
    children: [
      { label: '目录管理', nickName: 'toc', icon: '/src/assets/icons/bookSetting/tocIcon.svg', path: '/bookSetting/toc' },
      { label: '文档管理', nickName: 'docs', icon: '/src/assets/icons/bookSetting/docsIcon.svg', path: '/bookSetting/docs' },
      { label: '消息推送', nickName: 'webhooks', icon: '/src/assets/icons/bookSetting/webhooksIcon.svg', path: '/bookSetting/webhooks' },
      { label: '回收站', nickName: 'trash', icon: '/src/assets/icons/teamSetting/trash.svg', path: '/bookSetting/trash' }
    ]
  }
]
const route = useRoute()
const refreshStore = useRefreshStore()
const router = useRouter()
const currentBookInfo = ref({
  id: '',
  name: '',
  icon: ''
})
const currentMenu = ref('basic')
const spaceType = ref('') // 当前空间类型
const loading = ref(false)

const init = () => {
  spaceType.value = route.path.split('/')[1] === 'bookSetting' ? '个人' : '团队'
  currentBookInfo.value = JSON.parse(sessionStorage.getItem('currentBookInfo') as string) || {
    id: '',
    name: '',
    icon: ''
  }
  if (route.query.lid && route.query.lid != currentBookInfo.value.id && !route.path.includes('bookSetting')) {
    ElMessage.warning('前端存储知识库错误！')
  }
}

watchEffect(() => {
  route.path.split('/').length === 3 ? (currentMenu.value = route.path.split('/')[2]) : (currentMenu.value = route.path.split('/')[3])
  init()
  if (refreshStore.isRefreshBookSet) {
    getBookDetail(route.query.lid)
    refreshStore.setRefreshBookSet(false)
  }
})

watch(
  () => route.query.lid,
  (newVal) => {
    if (newVal && newVal != currentBookInfo.value.id) {
      loading.value = true
      nextTick(() => {
        getBookDetail(newVal)
      })
    }
  },
  {
    immediate: true
  }
)

const getBookDetail = async (id) => {
  let res = await getLibraryDetailApi(id)
  if (res.code === 1000) {
    nextTick(() => {
      sessionStorage.setItem('currentBookInfo', JSON.stringify(res.data))
      currentBookInfo.value = JSON.parse(sessionStorage.getItem('currentBookInfo') as string)
      loading.value = false
    })
  } else {
    ElMessage.error(res.msg)
  }
}

const toBack = () => {
  const query = route.query
  router.push({
    path: spaceType.value === '个人' ? `/directory/index` : `/${route.path.split('/')[1]}/directory/index`,
    query: { ...query }
  })
}

const toLink = (item: any) => {
  if (currentMenu.value === item.nickName) return
  currentMenu.value = item.nickName
  router.push({
    path: route.path.split('/').length === 3 ? `${item.path}` : '/' + route.path.split('/')[1] + item.path,
    query: {
      lid: route.query.lid,
      lname: route.query.lname,
      gid: route.query.gid,
      gname: route.query.gname,
      sid: route.query.sid,
      sname: route.query.sname
    }
  })
}
</script>

<template>
  <div class="BookSidebar_wrap" v-if="!loading">
    <div class="back" @click="toBack">
      <img src="/src/assets/icons/arrowRightIcon.svg" alt="" />
      <span>
        <img class="bookIcon" :src="currentBookInfo.icon" alt="" />
        {{ currentBookInfo.name }}
      </span>
    </div>
    <h4>知识库管理</h4>
    <div class="menu" v-for="(item, index) in menuList" :key="'menuList' + index">
      <div class="title">{{ item.label }}</div>
      <span :class="[it.nickName === currentMenu ? 'active' : '']" v-for="(it, index) in item.children" :key="'children' + index" @click="toLink(it)">
        <img :src="it.icon" alt="" />
        {{ it.label }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.BookSidebar_wrap {
  background-color: #fafafa;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px;
  .back {
    margin: 18px 0px 0px 6px;
    cursor: pointer;
    border-radius: 6px;
    padding: 5px 0px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      transform: rotate(90deg);
      margin-left: 3px;
      margin-right: 8px;
    }
    .bookIcon {
      transform: rotate(0deg);
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    span {
      color: #8a8f8d;
      font-size: 12px;
      line-height: 20px;
      display: flex;
      align-items: center;
    }
    &:hover {
      background-color: #eff0f0;
    }
  }
  h4 {
    font-weight: 600;
    color: #262626;
    font-size: 16px;
    line-height: 24px;
    margin: 21px 0px 5px 26px;
    box-sizing: border-box;
  }
  .menu {
    margin: 0 10px;
    .title {
      padding-left: 16px;
      margin: 21px 0 15px 0;
      color: #8a8f8d;
      box-sizing: border-box;
      font-size: 14px;
    }
    span {
      font-weight: 500;
      color: #262626;
      padding: 5px 16px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-radius: 6px;
      font-size: 14px;
      line-height: 22px;
      &:hover {
        background-color: #eff0f0;
      }
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    .active {
      background-color: #eff0f0 !important;
    }
  }
}
</style>

<script lang="ts" setup>
import userIcon from '@/assets/icons/user/user.svg'
import safetyIcon from '@/assets/icons/user/safety.svg'
import accountIcon from '@/assets/icons/user/account.svg'
import statsIcon from '@/assets/icons/user/stats.svg'
import grainsIcon from '@/assets/icons/user/grains.svg'
import arrowRightIcon from '@/assets/icons/arrowRightIcon.svg'
import favicon from '@/assets/favicon.ico'

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const userInfo = ref(JSON.parse(localStorage.getItem('xinAn-userInfo')) || {})
const avatar = 'http://10.4.150.56:8032/' + userInfo.value.avatar
const icon = ref(favicon)
const menuList = [
  {
    label: '账户',
    children: [
      { label: '个人信息', nickName: 'profile', icon: userIcon, path: '/user/profile' },
      { label: '安全日志', nickName: 'safety', icon: safetyIcon, path: '/user/safety' },
      { label: '账户管理', nickName: 'account', icon: accountIcon, path: '/user/account' }
    ]
  },
  {
    label: '创作中心',
    children: [
      { label: '数据统计', nickName: 'stats', icon: statsIcon, path: '/user/stats' },
      { label: '安币', nickName: 'grains', icon: grainsIcon, path: '/user/grains' }
    ]
  }
]

watchEffect(() => {
  if (infoStore.currentQuery.stype === 'organize') {
    icon.value = JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).icon
  } else {
    icon.value = favicon
  }
  if (refreshStroe.isRefreshUserInfo) {
    userInfo.value = JSON.parse(localStorage.getItem('xinAn-userInfo') || '{}')
    console.log(`output->`, userInfo.value)
    refreshStroe.setRefreshUserInfo(false)
  }
})

const toLink = (type: string, data?: any) => {
  if (type === 'back') {
    infoStore.currentQuery.stype === 'organize'
      ? router.push({
          path: `/${route.path.split('/')[1]}/dashboard`,
          query: {
            sid: infoStore.currentQuery.sid,
            sname: infoStore.currentQuery.sname
          }
        })
      : router.push({ path: '/dashboard' })
  } else {
    const basePath = route.path.split('/')[1] === 'user' ? '' : `/${route.path.split('/')[1]}`
    if (infoStore.currentMenu === type) return
    router.push({
      path: basePath + data.path,
      query: {
        ...route.query
      }
    })
  }
}
</script>

<template>
  <div class="UserSidebar_wrap">
    <div class="back" @click="toLink('back')">
      <img :src="arrowRightIcon" alt="" />
      <span>
        <img rounded-1 class="teamIcon" :src="icon" alt="" />
        返回
      </span>
    </div>
    <div flex w-full ml-10px mt-22px ml-22px>
      <img w-48px h-48px :src="avatar" alt="" />
      <div flex flex-col ml-12px items-start>
        <span text-16px text="#262626" line-height-24px>{{ userInfo.nickname }}</span>
        <span text-14px text="#8a8f8d" line-height-22px>{{ userInfo.post }}</span>
      </div>
    </div>
    <div class="menu" v-for="(item, index) in menuList" :key="'menuList' + index">
      <div class="title">{{ item.label }}</div>
      <span :class="[it.nickName === infoStore.currentMenu ? 'active' : '']" v-for="(it, index) in item.children" :key="'children' + index" @click="toLink(it.nickName, it)">
        <img :src="it.icon" alt="" />
        {{ it.label }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.UserSidebar_wrap {
  background-color: #fafafa;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px;
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #eff0f0;
  }
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
    .teamIcon {
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
    margin-top: 11px;
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

<script lang="ts" setup>
import teamInfoIcon from '@/assets/icons/teamSetting/teamInfo.svg'
import permissionsIcon from '@/assets/icons/teamSetting/permissions.svg'
import setIcon from '@/assets/icons/teamSetting/set.svg'
import trashIcon from '@/assets/icons/teamSetting/trash.svg'
import arrowRightIcon from '@/assets/icons/arrowRightIcon.svg'

const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const currentMenu = ref('basic')
const menuList = [
  {
    label: '设置',
    children: [
      { label: '团队信息', nickName: 'basic', icon: teamInfoIcon, path: '/teamSetting/basic' },
      { label: '权限', nickName: 'permission', icon: permissionsIcon, path: '/teamSetting/permission' },
      { label: '更多设置', nickName: 'settings', icon: setIcon, path: '/teamSetting/settings' }
    ]
  },
  {
    label: '高级设置',
    children: [{ label: '回收站', nickName: 'trash', icon: trashIcon, path: '/teamSetting/trash' }]
  }
]

watchEffect(() => {
  currentMenu.value = route.path.split('/')[3]
})

const toBack = () => {
  router.push({
    path: `/${route.path.split('/')[1]}/team/book`,
    query: {
      gname: route.query.gname,
      gid: route.query.gid,
      sid: route.query.sid,
      sname: route.query.sname
    }
  })
}

const toLink = (item: any) => {
  if (currentMenu.value === item.nickName) return
  currentMenu.value = item.nickName
  router.push({
    path: '/' + route.path.split('/')[1] + item.path,
    query: {
      gname: route.query.gname,
      gid: route.query.gid,
      sid: route.query.sid,
      sname: route.query.sname
    }
  })
}
</script>

<template>
  <div class="TeamSidebar_wrap">
    <div class="back" @click="toBack">
      <img :src="arrowRightIcon" alt="" />
      <span>
        <img class="teamIcon" :src="infoStore.currentTeamInfo.icon" alt="" />
        {{ infoStore.currentTeamInfo.groupname }}
      </span>
    </div>
    <h4>团队管理</h4>
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
.TeamSidebar_wrap {
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

<script lang="ts" setup>
import privateIcon from '@/assets/icons/privateIcon.svg'
import startIcon from '@/assets/icons/startIcon.svg'
import settingIcon from '@/assets/icons/settingIcon.svg'

const props = defineProps({
  icon: String
})
const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const currentItem = ref('book')
const headerItem = [
  {
    label: '知识库',
    value: 'book'
  },
  {
    label: '动态',
    value: 'dynamic'
  },
  {
    label: '话题',
    value: 'topic'
  },
  {
    label: '成员',
    value: 'member'
  }
]

watch(
  () => route.path,
  () => {
    currentItem.value = route.path.split('/')[3]
  },
  {
    immediate: true
  }
)

const toLink = (val) => {
  router.push({
    path: `/${route.path.split('/')[1]}/team/${val}`,
    query: route.query
  })
}

const toTeamSetting = () => {
  router.push({
    path: `/${infoStore.currentSpaceInfo.spacekey}/teamSetting/basic`,
    query: {
      gid: route.query.gid,
      gname: route.query.gname,
      sid: route.query.sid,
      sname: route.query.sname
    }
  })
}
</script>

<template>
  <div class="TeamHeader_wrap">
    <div class="left">
      <span class="teamIcon"><img :src="props.icon" alt="" /></span>
      <h3>{{ $route.query.gname }}</h3>
      <el-tooltip effect="dark" content="仅团队成员可访问" placement="bottom">
        <span class="privateIcon"><img :src="privateIcon" alt="" /></span>
      </el-tooltip>
      <el-tooltip effect="dark" content="收藏" placement="bottom">
        <span class="starIcon"> <img :src="startIcon" alt="" /></span>
      </el-tooltip>
      <div class="tab">
        <span :class="[currentItem === item.value ? 'active' : '']" v-for="(item, index) in headerItem" :key="'headerItem' + index" @click="toLink(item.value)">
          {{ item.label }}
        </span>
      </div>
    </div>
    <div class="right">
      <span @click="toTeamSetting"><img :src="settingIcon" alt="" /></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.TeamHeader_wrap {
  width: calc(100% + 72px);
  margin-right: -36px;
  margin-top: -26px;
  margin-left: -36px;
  padding: 0 36px;
  height: 61px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7e9e8;
  .left {
    display: flex;
    align-items: center;
    .teamIcon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 24px;
        width: 24px;
      }
    }
    .starIcon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 14px;
        width: 14px;
      }
    }
    .privateIcon {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 9px;
      img {
        width: 14px;
        width: 14px;
      }
    }
    h3 {
      font-size: 18px;
      line-height: 26px;
      margin-left: 12px;
      font-weight: 600;
      color: #262626;
    }
    .tab {
      margin-left: 36px;
      span {
        margin-right: 32px;
        color: #585a5a;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #262626;
        }
      }
      .active {
        color: #00b96b !important;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    span {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      &:hover {
        background-color: #f4f5f5;
      }
    }
  }
}
</style>

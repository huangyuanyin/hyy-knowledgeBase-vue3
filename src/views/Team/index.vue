<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const route = useRoute()
const userStore = useUserStore()
const listStore = useListStore()
const spaceId = ref(route.query.id)
const teamInput = ref('')
const isShowsTeamDialog = ref(false)
const teamList = ref([]) // 全部团队列表
const commonTeamList = ref([]) // 常用团队列表

watch(
  () => listStore.refreshQuickListStatus,
  (newVal) => {
    if (newVal) {
      getQuickLinks()
    }
  }
)

// 获取常用列表
const getQuickLinks = async () => {
  const params = {
    space: spaceId.value,
    user: userStore.userInfo.username
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonTeamList.value = res.data || []
    listStore.setRefreshQuickListStatus(false)
    // 遍历全部团队列表和常用团队列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
    teamList.value.forEach((item) => {
      item.is_common_id = null
      commonTeamList.value.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
    console.log(`output->常用列表`, teamList.value)
  }
}

onMounted(async () => {
  const { groupsList, getGroups } = await useGroupsApi(getGroupsApi, { space: spaceId.value })
  teamList.value = groupsList.value.filter((item) => item.is_default !== '1')
  getGroups()
  getQuickLinks()
})

console.log(`output->第几个呢23232`)
</script>

<template>
  <div class="Team_wrap">
    <div class="header">
      <span>团队</span>
      <div class="button">
        <el-input v-model="teamInput" class="w-50 m-2" placeholder="搜索团队" clearable>
          <template #prefix>
            <i-ep-Search />
          </template>
        </el-input>
        <el-button @click="isShowsTeamDialog = true">
          <template #icon>
            <img class="addIcon" src="/src/assets/icons/addIcon.svg" alt="" />
            <img class="addIcon_hover" src="/src/assets/icons/addIcon_hover.svg" alt="" />
          </template>
          新建团队
        </el-button>
      </div>
    </div>
    <CommonList :list="commonTeamList" />
    <TableComp :header="['名称', '简介', '成员', '加入时间', '']" type="team" :data="teamList" />
    <TeamDialog :isShow="isShowsTeamDialog" @closeDialog="isShowsTeamDialog = false" />
  </div>
</template>

<style lang="scss" scoped>
.Team_wrap {
  max-width: 1585px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #262626;
    font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    .button {
      display: flex;
      align-items: center;
      color: #262626;
      .el-input {
        margin-right: 12px;
        max-width: 164px;
      }
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }

      .el-button {
        border-radius: 6px;
        .addIcon {
          display: flex;
        }
        .addIcon_hover {
          display: none;
        }
        &:hover {
          color: #009456;
          border-color: #009456;
          background-color: #fff;
          .addIcon {
            display: none;
          }
          .addIcon_hover {
            display: flex;
          }
        }
      }
    }
  }
  :deep(.CommonList_wrap) {
    margin-bottom: 26px;
  }
}
</style>

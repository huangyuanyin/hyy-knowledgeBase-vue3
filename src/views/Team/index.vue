<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getQuickLinksApi } from '@/api/quickLinks'

const route = useRoute()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const spaceId = ref('') // 当前公共空间id
const teamInput = ref('')
const isShowsTeamDialog = ref(false)
const groupsList = ref([]) // 当前空间下除公共区外全部团队
const commonTeamList = ref([]) // 当前空间下常用团队列表

watchEffect(() => {
  spaceId.value = route.query.sid as string
  if (refreshStroe.isRefreshQuickTeamList) {
    nextTick(() => {
      getQuickLinks()
    })
  }
})

// 获取当前空间下的全部团队（除去公共区）
const getGroups = async () => {
  const params = {
    space: spaceId.value,
    is_default: '0',
    permusername: user
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    groupsList.value = res.data || ([] as any)
  }
}

// 获取常用列表
const getQuickLinks = async () => {
  const params = {
    space: spaceId.value,
    target_type: 'group',
    user
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonTeamList.value = res.data || ([] as any)
    // 遍历团队列表和常用团队列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
    groupsList.value.forEach((item) => {
      item.is_common_id = null
      commonTeamList.value.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
  }
}

onMounted(async () => {
  await getGroups()
  await getQuickLinks()
})
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
    <CommonList :list="commonTeamList" type="team" v-if="commonTeamList.length" />
    <TableComp :style="{ 'margin-top': commonTeamList.length ? '' : '26px' }" :header="['名称', '简介', '成员', '创建人', '加入时间', '']" type="team" :data="groupsList" />
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
    margin-bottom: 22px;
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

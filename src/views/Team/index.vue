<script lang="ts" setup>
import addIcon from '@/assets/icons/addIcon.svg'
import addIcon_hover from '@/assets/icons/addIcon_hover.svg'
import { isDefaultType } from '@/type/type'

const refreshStroe = useRefreshStore()
const teamInput = ref('')
const isShowsTeamDialog = ref(false)
const teamList = ref([]) // 当前空间下除公共区外全部团队
const cTeamList = ref([]) // 当前空间下常用团队列表

const { commonTeamList, getCommonList, findCommonItem } = useCommon()
const { teamList: list, getTeamList } = useTeam()

watchEffect(() => {
  if (refreshStroe.isRefreshQuickTeamList) {
    nextTick(() => {
      getCommonTeamList()
    })
  }
})

// 获取当前空间下的全部团队（除去公共区）
const getTeam = async () => {
  const params = {
    is_default: '0' as isDefaultType
  }
  await getTeamList(params)
  teamList.value = list.value
}

// 获取常用团队列表
const getCommonTeamList = async () => {
  await getCommonList('group')
  cTeamList.value = commonTeamList.value
  findCommonItem('group', teamList.value)
}

onMounted(async () => {
  await getTeam()
  await getCommonTeamList()
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
            <img class="addIcon" :src="addIcon" alt="" />
            <img class="addIcon_hover" :src="addIcon_hover" alt="" />
          </template>
          新建团队
        </el-button>
      </div>
    </div>
    <CommonList :list="cTeamList" type="team" v-if="cTeamList.length" />
    <TableComp :style="{ 'margin-top': cTeamList.length ? '' : '26px' }" :header="['名称', '简介', '成员', '创建人', '加入时间', '']" type="team" :data="teamList" />
    <TeamDialog :isShow="isShowsTeamDialog" @closeDialog="isShowsTeamDialog = false" />
  </div>
</template>

<style lang="scss" scoped>
.Team_wrap {
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

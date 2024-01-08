<script lang="ts" setup>
import moreIcon from '@/assets/icons/organize/moreIcon.svg'
import { isDefaultType } from '@/type/type'

const route = useRoute()
const router = useRouter()
const routeInfo = { route, router }
const isShowTeamDialog = ref(false)
const teamData = ref([])
const teamSettingData = [
  { type: 'item', icon: '', label: '查看团队', nick: 'toTeamIndex' },
  { type: 'item', icon: '', label: '团队设置', nick: 'toTeamSetting' },
  { type: 'item', icon: '', label: '删除团队', nick: 'toDeleteTeam' }
]

const { teamList: list, getTeamList } = useTeam()

const getTeam = async () => {
  const params = {
    is_default: '0' as isDefaultType
  }
  await getTeamList(params)
  teamData.value = list.value
}

const toTeamSetting = (val) => {
  useLink(routeInfo, 'fromSpaceSetToTeamSet', val)
}

const toTeamIndex = (val) => {
  useLink(routeInfo, 'fromSpaceSetToTeamIndex', val)
}

const toDeleteTeam = (val) => {
  useLink(routeInfo, 'fromSpaceSetToTeamSettings', val)
}

onMounted(() => {
  getTeam()
})
</script>

<template>
  <div class="TeamManage_wrap">
    <div class="header">
      <span>团队管理</span>
      <div>
        <el-input placeholder="搜索团队" disabled></el-input>
        <el-button @click="isShowTeamDialog = true">新建团队</el-button>
      </div>
    </div>
    <div class="box">
      <el-table :data="teamData" stripe style="width: 100%" empty-text="暂无团队">
        <el-table-column prop="groupname" label="名称" width="250" />
        <el-table-column prop="creator_name" label="管理员" width="250" />
        <el-table-column prop="create_datetime" label="创建时间" width="250" />
        <el-table-column prop="book_count" label="知识库" width="250" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <LibraryOperationPopver :menuItems="teamSettingData" @toTeamSetting="toTeamSetting(row)" @toTeamIndex="toTeamIndex(row)" @toDeleteTeam="toDeleteTeam(row)">
              <span class="more-icon" @click.stop>
                <span class="more"><img :src="moreIcon" alt="" /></span>
              </span>
            </LibraryOperationPopver>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <TeamDialog :isShow="isShowTeamDialog" @closeDialog="isShowTeamDialog = false" @updateTeam="getTeam" />
</template>

<style lang="scss" scoped>
.TeamManage_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      height: 32px;
      :deep(.el-input__wrapper) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
      .el-button {
        margin-left: 8px;
        background: #00b96b;
        border-color: #00b96b;
        color: #fff;
        border-radius: 6px;
        span {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
      }
    }
  }
  .box {
    max-width: 1080px;
    .more {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 16px;
        height: 16px;
      }
      &:hover {
        background-color: #e7e9e8;
        cursor: pointer;
      }
    }
  }
}
</style>

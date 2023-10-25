<template>
  <div class="Settings_wrap">
    <div class="header">更多设置</div>
    <div class="box">
      <div class="options">
        <h3>高级选项</h3>
        <div class="item" v-for="(item, index) in optionsList" :key="'optionsList' + index">
          <div class="left">
            <span>{{ item.label }}</span>
            <p>{{ item.desc }}</p>
          </div>
          <div class="right">
            <el-switch v-model="item.value" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bec0bf" @change="toChangeStatus(item)" />
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="options">
        <h3>团队操作</h3>
        <div class="item">
          <div class="left">
            <span>删除团队</span>
            <p>删除权限只有团队管理员拥有。注意！删除团队后，你将丢失该团队中的所有数据。</p>
          </div>
          <div class="right">
            <el-button type="danger" @click="toDeleteTeam">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DeleteDialog title="删除团队" :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<script lang="ts" setup>
import { getGroupsDetailApi } from '@/api/groups/index'

const route = useRoute()
const optionsList = [
  {
    label: '动态',
    desc: '开启后可展示本团队内文档、任务、话题等的更新动态，方面成员获取重要信息，提高协同效率。',
    value: true
  },
  {
    label: '话题知识库',
    desc: '开启后成员可聚焦话题展开讨论，在线异步交流。',
    value: true
  },
  {
    label: '资源知识库',
    desc: '开启后成员可分享和交流设计稿、图片或本地文件等，用于管理图片和文件资源。',
    value: false
  },
  {
    label: '任务',
    desc: '开启后可用于管理团队事务，可帮助团队有序规划、执行和跟进任务。',
    value: false
  }
]
const isShowsDeleteDialog = ref(false)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
}>({})

const toDeleteTeam = async () => {
  await getGroupsDetail(route.query.gid)
  isShowsDeleteDialog.value = true
}

const getGroupsDetail = async (id: number) => {
  let res = await getGroupsDetailApi(id)
  if (res.code === 1000) {
    deleteInfo.value.id = res.data.id
    deleteInfo.value.name = res.data.groupname
    deleteInfo.value.slug = res.data.groupkey
    console.log(`output->`)
  } else {
    ElMessage.error(res.msg)
  }
}

const toChangeStatus = (item) => {
  ElMessage.warning('暂不支持自定义')
}
</script>

<style lang="scss" scoped>
.Settings_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  .box {
    max-width: 668px;
    .options {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #262626;
      }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        margin-bottom: 24px;
        .left {
          display: flex;
          flex-direction: column;
          span {
            font-size: 14px;
            color: #262626;
            line-height: 22px;
          }
          p {
            line-height: 22px;
            margin-top: 6px;
            font-size: 14px;
            color: #8a8f8d;
          }
        }
      }
    }
    .divider {
      margin-top: 28px;
      margin-bottom: 28px;
      display: flex;
      clear: both;
      width: 100%;
      min-width: 100%;
      margin: 24px 0;
      box-sizing: border-box;
      padding: 0;
      color: #262626;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: 'tnum';
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
}
</style>

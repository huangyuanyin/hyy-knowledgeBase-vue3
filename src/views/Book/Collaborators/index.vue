<template>
  <div class="Collaborators_wrap">
    <div class="header">权限</div>
    <div class="box">
      <div class="publicity">
        <span>公开性</span>
        <el-radio-group v-model="publicityValue" class="publicityRadio">
          <el-radio label="1" size="large" disabled>仅协作者可访问</el-radio>
          <el-radio label="2" size="large">空间所有成员可访问</el-radio>
        </el-radio-group>
      </div>
      <div class="collaborator">
        <div class="header">
          <span>协作者</span>
          <div>
            <el-input disabled placeholder="搜索成员"></el-input>
            <el-button @click="isShowAddBookMemberDialog = true">添加</el-button>
          </div>
        </div>
        <el-table :data="memberData" stripe style="width: 100%">
          <el-table-column prop="name" label="用户">
            <template #default="{ row }">
              <div class="cell">
                <img :src="row.avatar || '/src/assets/img/img.jpg'" alt="" />
                <span class="name">{{ row.name }}</span>
                <span class="count" v-if="row.label">(1人)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="permtype" label="权限">
            <template #default="{ row }">
              <span v-if="row.label === 'teamAdmin'">可管理</span>
              <span v-else-if="row.label === 'teamMember'">可编辑</span>
              <span v-else>可编辑</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="{ row }">
              <el-button type="text" size="small" v-if="!row.label" @click="handleDelete(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <addBookMemberDialog :isShow="isShowAddBookMemberDialog" @closeDialog="isShowAddBookMemberDialog = false" :selectMember="memberList" />
</template>

<script lang="ts" setup>
import { getCollaborationsApi } from '@/api/collaborations'

const route = useRoute()
const isShowAddBookMemberDialog = ref(false)
const publicityValue = ref('2')
const memberList = ref([])
const memberData = ref([])
const teamInfo = ref([
  {
    avatar: '/src/assets/icons/teamIcon.svg',
    label: 'teamAdmin',
    name: '团队管理员'
  },
  {
    avatar: '/src/assets/icons/teamIcon.svg',
    label: 'teamMember',
    name: '团队成员'
  }
])

const getCollaborations = async () => {
  const params = {
    book: route.query.lid as string
  }
  const res = await getCollaborationsApi(params)
  if (res.code === 1000) {
    memberData.value = res.data
    memberData.value = [...teamInfo.value, ...memberData.value]
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getCollaborations()
})
</script>

<style lang="scss" scoped>
.Collaborators_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    margin-bottom: 28px;
  }
  .box {
    max-width: 1080px;
    .publicity {
      margin-bottom: 56px;
      span {
        color: #262626;
        line-height: 24px;
        margin-bottom: 14px;
        display: flex;
      }
      .publicityRadio {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .collaborator {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
          color: #262626;
        }
        div {
          display: flex;
          align-items: center;
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
            color: #fff;
            border-color: #00b96b;
            background-color: #00b96b;
            &:hover {
              border-color: #009456;
              background-color: #009456;
            }
          }
        }
      }
      .cell {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
          border-radius: 12px;
        }
        .name {
          margin-left: 16px;
        }
        .name,
        .count {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 272px;
          margin: 0 0 0 16px;
          line-height: 32px;
          font-size: 14px;
          font-weight: 400;
          color: #262626;
        }
      }
    }
  }
}
</style>

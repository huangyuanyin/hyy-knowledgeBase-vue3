<script lang="ts" setup>
import { getLibraryDetailApi, editLibraryApi } from '@/api/library'
import { getCollaborationsApi, deleteCollaborationsApi } from '@/api/collaborations'
import { getTeamMemberApi } from '@/api/member'
import { getSpacesDetailApi } from '@/api/spaces'

const route = useRoute()
const router = useRouter()
const nickname = JSON.parse(localStorage.getItem('userInfo')).nickname || ''
const spaceType = ref('')
const spaceId = ref('')
const spaceName = ref('')
const groupId = ref('')
const stacksId = ref('')
const bookId = ref('')
const slug = ref('')
const name = ref('')
const isShowAddBookMemberDialog = ref(false)
const publicType = ref('2')
const memberList = ref([])
const memberData = ref([])
const bookAdmin = ref([
  {
    label: 'bookAdmin',
    name: ''
  }
])
const teamInfo = ref([
  {
    avatar: '/src/assets/icons/spaceIcon.svg',
    label: 'spaceAdmin',
    name: '空间管理员',
    member: null
  },
  {
    avatar: '/src/assets/icons/teamIcon.svg',
    label: 'teamAdmin',
    name: '团队管理员',
    member: null
  }
])

watchEffect(() => {
  spaceType.value = route.path.split('/')[1] === 'bookSetting' ? '个人空间' : '组织空间'
  spaceName.value = route.path.split('/')[1]
  spaceType.value === '个人空间' ? (spaceId.value = JSON.parse(localStorage.getItem('personalSpaceInfo')).id) : (spaceId.value = route.query.sid as string)
  groupId.value = route.query.gid as string
  bookId.value = route.query.lid as string
})

const toCloseDialog = () => {
  isShowAddBookMemberDialog.value = false
  getCollaborations()
}

const toLink = (label) => {
  if (label === 'spaceAdmin') {
    router.push({
      path: `/${spaceName.value}/organize/addressBook`,
      query: {
        sid: spaceId.value,
        sname: route.query.sname as string
      }
    })
  } else if (label === 'teamAdmin') {
    router.push({
      path: `/${spaceName.value}/team/member`,
      query: {
        sid: spaceId.value,
        sname: route.query.sname as string,
        gid: groupId.value,
        gname: route.query.gname as string
      }
    })
  }
  console.log('toLink')
}

const toChangePublic = (val) => {
  const params = {
    space: spaceId.value,
    group: groupId.value,
    stacks: stacksId.value,
    slug: slug.value,
    name: name.value,
    public: val
  }
  editBook(params)
}

const getCollaborations = async () => {
  const params = {
    book: bookId.value
  }
  const res = await getCollaborationsApi(params)
  if (res.code === 1000) {
    memberList.value = res.data
    memberData.value = [...teamInfo.value, ...bookAdmin.value, ...memberList.value]
  } else {
    ElMessage.error(res.msg)
  }
}

const getBookDetail = async () => {
  const res = await getLibraryDetailApi(bookId.value)
  if (res.code === 1000) {
    publicType.value = res.data.public
    spaceId.value = res.data.space
    groupId.value = res.data.group
    stacksId.value = res.data.stacks
    slug.value = res.data.slug
    name.value = res.data.name
    bookAdmin.value[0].name = res.data.creator_name
    if (spaceType.value === '个人空间') {
      memberData.value = [...bookAdmin.value]
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const editBook = async (params) => {
  const res = await editLibraryApi(params, bookId.value)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteCollaborations = async (id) => {
  const res = await deleteCollaborationsApi(id)
  if (res.code === 1000) {
    ElMessage.success('移除成功')
    getCollaborations()
  } else {
    ElMessage.error(res.msg)
  }
}

const getTeamMember = async () => {
  const params = {
    group: groupId.value,
    role: '1'
  }
  const res = await getTeamMemberApi(params)
  if (res.code === 1000) {
    teamInfo.value[1].member = res.data.length + 1
  } else {
    ElMessage.error(res.msg)
  }
}

const getSpacesDetail = async () => {
  const res = await getSpacesDetailApi(spaceId.value)
  if (res.code === 1000) {
    teamInfo.value[0].member = res.data.members.filter((it) => it.permtype !== '1').length + 1
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  if (spaceType.value === '组织空间') {
    getTeamMember()
    getSpacesDetail()
    getCollaborations()
  }
  getBookDetail()
})
</script>

<template>
  <div class="Collaborators_wrap">
    <div class="header">权限</div>
    <div class="box">
      <div class="publicity">
        <span>公开性</span>
        <el-radio-group v-model="publicType" class="publicityRadio" @change="toChangePublic">
          <el-radio label="0" size="large">仅协作者可访问</el-radio>
          <el-radio v-if="spaceType === '组织空间'" label="1" size="large">团队所有成员可访问</el-radio>
          <el-radio v-if="spaceType === '组织空间'" label="2" size="large">空间所有成员可访问</el-radio>
        </el-radio-group>
      </div>
      <div class="collaborator">
        <div class="header">
          <span>知识库成员</span>
          <div>
            <el-input disabled placeholder="搜索成员"></el-input>
            <el-button v-if="spaceType.value === '组织空间'" @click="isShowAddBookMemberDialog = true">添加</el-button>
          </div>
        </div>
        <el-table :data="memberData" stripe style="width: 100%">
          <el-table-column prop="name" label="用户">
            <template #default="{ row }">
              <div class="cell">
                <img :src="row.avatar || '/src/assets/img/img.jpg'" alt="" />
                <span class="name" @click="toLink(row.label)">{{ row.name }}</span>
                <span v-if="nickname === row.name" class="my_tag">你自己</span>
                <span class="count" v-if="['teamAdmin', 'spaceAdmin'].includes(row.label)">({{ row.member }})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="permtype" label="权限">
            <template #default="{ row }">
              <span v-if="['teamAdmin', 'spaceAdmin', 'bookAdmin'].includes(row.label)">可管理</span>
              <span v-else>可编辑</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="{ row }">
              <el-button type="danger" text size="small" v-if="!row.label" @click="deleteCollaborations(row.id)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <AddBookMemberDialog :isShow="isShowAddBookMemberDialog" @closeDialog="toCloseDialog" :selectMember="memberList" />
</template>

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
        .my_tag {
          margin-left: 8px;
          background-color: #eff0f0;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
          color: #585a5a;
        }
      }
    }
  }
}
</style>

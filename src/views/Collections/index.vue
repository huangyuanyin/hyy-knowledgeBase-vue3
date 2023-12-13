<script lang="ts" setup>
import emptyImg from '@/assets/img/empty.png'
import { getMarksApi } from '@/api/marks'
import { addTagApi, deleteTagApi, editTagApi, getTagApi } from '@/api/tag'

const route = useRoute()
const refreshStroe = useRefreshStore()
const isShowsGroupDialog = ref(false)
const groupTitle = ref('新建分组')
const groupName = ref('')
const groupId = ref(null)
const groupActive = ref(0)
const groups = ref([
  {
    id: 0,
    name: '全部收藏',
    marks_count: ''
  }
])
const groupMenuItems = [
  { type: 'item', icon: '', label: '编辑', nick: 'editTag' },
  { type: 'item', icon: '', label: '删除', nick: 'deleteTag' }
]
const starList = ref([])
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''

watchEffect(() => {
  if (refreshStroe.isRefreshMark) {
    getMarks(groupActive.value === 0 ? '' : groupActive.value)
    refreshStroe.setRefreshMark(false)
  }
})

watch(
  () => route.path,
  async () => {
    if (route.path.includes('collections')) {
      await getTags()
      await getMarks()
    }
  }
)

const toDo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toSelectGroup = (val: any) => {
  groupActive.value = val.id
  getMarks(val.name === '全部收藏' ? '' : groupActive.value)
}

const toAddTag = (name: string) => {
  addTags(name)
}

const toEditTag = (name: string) => {
  handleEditTagApi(name)
}

const showTag = () => {
  isShowsGroupDialog.value = true
  groupTitle.value = '新建分组'
  groupName.value = ''
}

const editTag = (group: any) => {
  isShowsGroupDialog.value = true
  groupTitle.value = '编辑分组'
  groupName.value = group.name
  groupId.value = group.id
}

const deleteTag = async (group: any) => {
  let res = await deleteTagApi(group.id)
  if (res.code === 1000) {
    getTags()
    ElMessage.success('操作成功')
    if (group.id === groupActive.value) {
      toSelectGroup({
        id: 0,
        name: '全部收藏',
        marks_count: ''
      })
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const handleEditTagApi = async (name) => {
  const params = {
    name,
    space: route.query.sid as string,
    creator: user
  }
  let res = await editTagApi(groupId.value, params)
  if (res.code === 1000) {
    getTags()
    ElMessage.success('操作成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const getTags = async () => {
  const params = {
    space: route.query.sid as string,
    creator: user,
    action_type: 'mark'
  }
  let res = await getTagApi(params)
  if (res.code === 1000) {
    groups.value = groups.value.slice(0, 1)
    groups.value = groups.value.concat(res.data as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const addTags = async (name: string) => {
  const params = {
    space: route.query.sid as string,
    name,
    action_type: 'mark'
  }
  let res = await addTagApi(params)
  if (res.code === 1000) {
    isShowsGroupDialog.value = false
    getTags()
    ElMessage.success('新建分组成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const getMarks = async (id?) => {
  const params = {
    space: route.query.sid as string,
    creator: user
  } as any
  id && (params.tags_id = id)
  let res = await getMarksApi(params)
  if (res.code === 1000) {
    starList.value = res.data as any
    if (groupActive.value === 0) {
      groups.value[0].marks_count = res.data.length
    }
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getTags()
  await getMarks()
})
</script>

<template>
  <div class="Collections_wrap">
    <div class="header">
      <span>收藏</span>
      <div class="search">
        <span @click="toDo"><img src="/src/assets/icons/searchIcon.svg" alt="" /></span>
        <span @click="toDo"><img src="/src/assets/icons/filterIcon.svg" alt="" /></span>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div :class="['group', groupActive === group.id ? 'groupActive' : '']" v-for="(group, index) in groups" :key="index" @click="toSelectGroup(group)">
          <div class="group-header">
            <span>{{ group.name }}</span>
            <span class="collectionGroupIcon">
              <el-tooltip effect="dark" content="新建分组" placement="top">
                <img v-if="group.name === '全部收藏'" src="/src/assets/icons/collectionGroupIcon.svg" alt="" @click="showTag" />
              </el-tooltip>
              <LibraryOperationPopver :width="110" trigger="hover" :menuItems="groupMenuItems" @editTag="editTag(group)" @deleteTag="deleteTag(group)">
                <img v-if="group.name !== '全部收藏'" src="/src/assets/icons/moreIcon1.svg" alt="" @click="" />
              </LibraryOperationPopver>
            </span>
          </div>
          <div class="count">{{ group.marks_count }} 条内容</div>
        </div>
      </div>
      <div class="right">
        <TableComp :header="['名称', '归属', '收藏时间', '']" type="star" :data="(starList as any)" />
        <div v-if="!starList.length" class="empty">
          <img :src="emptyImg" alt="" />
          <span>暂无内容</span>
          <span>快去收藏吧</span>
        </div>
      </div>
    </div>
  </div>
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTag="toAddTag" @toEditTag="toEditTag" :title="groupTitle" :name="groupName" />
</template>

<style lang="scss" scoped>
.Collections_wrap {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 18px;
      color: #262626;
    }
    .search {
      display: flex;
      align-items: center;
      span {
        width: 24px;
        height: 24px;
        margin-left: 15px;
        margin-right: 5px;
        cursor: pointer;
      }
      img {
        width: 16px;
        min-width: 16px;
        height: 16px;
      }
    }
  }
  .content {
    display: flex;
    flex: 1;
    margin-top: 20px;
    margin-bottom: -26px;
    .left {
      height: calc(100vh - 44px - 26px);
      overflow: auto;
      width: 203px;
      min-width: 203px;
      border-right: 1px solid rgba(0, 0, 0, 0.04);
      padding: 0 12px 20px 0;
      box-sizing: border-box;
      .group {
        height: 74px;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:hover {
          background-color: #eff0f0;
          cursor: pointer;
        }
        &-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .collectionGroupIcon {
            width: 22px;
            height: 22px;
            img {
              cursor: pointer;
              width: 18px;
              min-width: 18px;
              height: 18px;
            }
          }

          span {
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #262626;
          }
        }
        .count {
          font-size: 12px;
          color: #8a8f8d;
        }
      }
      .groupActive {
        background-color: #eff0f0;
      }
    }
    .right {
      flex: 1;
      padding: 0px 24px;
      .empty {
        height: 80vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        img {
          margin-bottom: 16px;
          width: 120px;
        }
        span {
          font-size: 14px;
          color: #8a8f8d;
        }
      }
    }
  }
}
</style>

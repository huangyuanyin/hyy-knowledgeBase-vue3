<script lang="ts" setup>
import emptyImg from '@/assets/img/empty.png'
import searchImg from '@/assets/img/search.png'
import { Search } from '@element-plus/icons-vue'

const refreshStroe = useRefreshStore()
const isShowsGroupDialog = ref(false)
const groupTitle = ref('新建分组')
const groupName = ref('')
const groupId = ref(null)
const title = ref('')
const tagActive = ref(0)
const isSearch = ref(false)
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
const collectList = ref([])

const { tagList, getTagList, addTag, editTag, deleteTag } = useTag()
const { collectList: clist, getCollectList } = useCollect()

watchEffect(() => {
  if (refreshStroe.isRefreshMark) {
    toGetTagList()
    toGetCollectList(tagActive.value === 0 ? '' : tagActive.value)
    refreshStroe.setRefreshMark(false)
  }
  // if (route.meta.menu === 'collections') {
  //   console.log(`output->232`, 232)
  //   nextTick(async () => {
  //     await toGetTagList()
  //     await toGetCollectList()
  //   })
  // }
})

onMounted(async () => {
  await toGetTagList()
  await toGetCollectList()
})

const toSelectGroup = (val: any) => {
  tagActive.value = val.id
  toGetCollectList(val.name === '全部收藏' ? '' : val.id)
}

const toGetTagList = async () => {
  await getTagList()
  groups.value = groups.value.slice(0, 1).concat(tagList.value)
}

const toAddTag = (name: string) => {
  addTag(name, () => {
    isShowsGroupDialog.value = false
    toGetTagList()
  })
}

const toEditTag = (name: string) => {
  editTag(groupId.value, name, () => {
    toGetTagList()
  })
}

const toDeleteTag = async (tagId: number) => {
  deleteTag(tagId, () => {
    toGetTagList()
    if (tagId === tagActive.value) {
      toSelectGroup({
        id: 0,
        name: '全部收藏',
        marks_count: ''
      })
    }
  })
}

const toShowTagDialog = (type: string, group?: any) => {
  isShowsGroupDialog.value = true
  if (type === 'add') {
    groupTitle.value = '新建分组'
    groupName.value = ''
  } else {
    groupTitle.value = '编辑分组'
    groupName.value = group.name
    groupId.value = group.id
  }
}

const toGetCollectList = async (id?) => {
  await getCollectList(id, title.value, (res) => {
    if (tagActive.value === 0) {
      groups.value[0].marks_count = res.length
    }
  })
  collectList.value = clist.value
}

const toSearch = () => {
  toGetCollectList(tagActive.value === 0 ? '' : tagActive.value)
  if (title.value === '') {
    isSearch.value = false
  }
}

const toDo = (val) => {
  switch (val) {
    case 'title':
      isSearch.value = true
      break
    case 'type':
      ElMessage.warning('该功能暂未开放，敬请期待！')
      break
  }
}
</script>

<template>
  <div class="Collections_wrap">
    <div class="header">
      <span>收藏</span>
      <div class="search">
        <span @click="toDo('title')" v-if="!isSearch" flex items-center><img src="/src/assets/icons/searchIcon.svg" alt="" /></span>
        <el-input v-else v-model="title" @change="toSearch" width="200px" clearable :prefix-icon="Search" placeholder=""></el-input>
        <span @click="toDo('type')" flex items-center><img src="/src/assets/icons/filterIcon.svg" alt="" /></span>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div :class="['group', tagActive === group.id ? 'tagActive' : '']" v-for="(group, index) in groups" :key="index" @click="toSelectGroup(group)">
          <div class="group-header">
            <span>{{ group.name }}</span>
            <span class="collectionGroupIcon">
              <el-tooltip effect="dark" content="新建分组" placement="top">
                <img v-if="group.name === '全部收藏'" src="/src/assets/icons/collectionGroupIcon.svg" alt="" @click.stop="toShowTagDialog('add')" />
              </el-tooltip>
              <LibraryOperationPopver :width="110" trigger="hover" :menuItems="groupMenuItems" @editTag="toShowTagDialog('edit', group)" @deleteTag="toDeleteTag(group.id)">
                <img v-if="group.name !== '全部收藏'" src="/src/assets/icons/moreIcon1.svg" alt="" @click.stop />
              </LibraryOperationPopver>
            </span>
          </div>
          <div class="count">{{ group.marks_count }} 条内容</div>
        </div>
      </div>
      <div class="right">
        <TableComp :header="['名称', '归属', '收藏时间', '']" type="star" :data="(collectList as any)" />
        <div v-if="!collectList.length && !title" class="empty">
          <img :src="emptyImg" alt="" />
          <span>暂无内容</span>
          <span>快去收藏吧</span>
        </div>
        <Empty v-if="!collectList.length && title" :img="searchImg" height="60vh" text="搜索结果为空" />
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
      height: 34px;
      display: flex;
      align-items: center;
      margin-right: 20px;
      :deep(.el-input) {
        .is-focus {
          border-color: #0bd07d !important;
        }
      }
      :deep(.el-input__wrapper) {
        width: 10vw;
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
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
    margin-top: 17px;
    margin-bottom: -26px;
    .left {
      height: calc(100vh - 44px - 34px);
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
      .tagActive {
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

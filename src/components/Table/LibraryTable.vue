<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'
import { getLibraryApi } from '@/api/library'
import { addBookStacksApi, deleteBookStacksApi, editBookStacksApi, getBookStacksApi } from '@/api/bookstacks'

type LibraryGroup = {
  id: number
  name: string
  is_default: string
  library?: any
}

const props = defineProps({
  title: {
    type: String,
    default: '我的知识库'
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  showMove: {
    type: Boolean,
    default: true
  },
  group: {
    type: Array as PropType<LibraryGroup[]>,
    default: () => []
  },
  commonList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['getBookStacks'])

const route = useRoute()
const refreshStroe = useRefreshStore()
const infoStore = useInfoStore()
const spaceType = ref('') // 当前空间类型
const spaceId = ref('') // 当前空间id
const groupId = ref('') // 当前团队id
const stackId = ref('') // 当前知识库分组id
const isShowsLibraryDialog = ref(false)
const processedGroup = ref([])
const editedName = ref('')
const addOperation = [
  {
    type: 'item',
    label: '新建知识库',
    nick: 'addLibrary',
    icon: ''
  },
  {
    type: 'item',
    label: '添加已有知识库...',
    nick: 'addExistLibrary',
    icon: ''
  }
  // {
  //   type: 'divider'
  // },
  // {
  //   type: 'item',
  //   label: '新建分组',
  //   nick: 'addGroup',
  //   icon: ''
  // }
]
const addLibraryOperation = [
  {
    type: 'item',
    label: '新建知识库',
    nick: 'addLibrary',
    icon: ''
  },
  {
    type: 'divider'
  },
  {
    type: 'item',
    label: '新建分组',
    nick: 'addGroup',
    icon: ''
  }
]

watch(
  () => props.group,
  async (newVal) => {
    console.log(`output->props.group33333`, props.group)
    if (newVal.length) {
      await Promise.all(
        props.group.map(async (item) => {
          const library = await getLibrary(item.id)
          item.library = library
          item.library.map((it) => {
            it.is_common_id = null
            props.commonList.map((val: any) => {
              if (it.id === Number(val.target_id)) {
                it.is_common_id = val.id
              }
            })
          })
        })
      )
      processedGroup.value = props.group
      processedGroup.value.map((item) => {
        item.is_editing = false
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.commonList,
  (newVal) => {
    if (newVal.length) {
      processedGroup.value.map((item) => {
        item.library.map((it) => {
          it.is_common_id = null
          newVal.map((val: any) => {
            if (it.id === Number(val.target_id)) {
              it.is_common_id = val.id
            }
          })
        })
      })
    }
  },
  {
    immediate: true
  }
)

const handleID = () => {
  sessionStorage.getItem('currentSidebar') === 'Sidebar' ? (spaceType.value = '个人') : (spaceType.value = '组织')
  spaceId.value = spaceType.value === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
  groupId.value = spaceType.value === '个人' ? localStorage.getItem('personalGroupId') : (route.query.gid as string)
}

watchEffect(async () => {
  await handleID()
  if (refreshStroe.isRefreshBookList) {
    await Promise.all(
      props.group.map(async (item) => {
        const library = await getLibrary(item.id)
        item.library = library
      })
    )
    processedGroup.value = props.group
    processedGroup.value.map((item) => {
      item.is_editing = false
    })
    refreshStroe.setRefreshBookList(false)
  }
  if (refreshStroe.isRefreshBookStacks) {
    const params = {
      space: spaceId.value,
      group: groupId.value
    }
    let res = await getBookStacksApi(params)
    if (res.code === 1000) {
      await Promise.all(
        res.data.map(async (item) => {
          const library = await getLibrary(item.id)
          item.library = library
        })
      )
      processedGroup.value = res.data || ([] as any)
      processedGroup.value.map((item) => {
        item.is_editing = false
      })
      refreshStroe.setRefreshBookList(false)
    }
    refreshStroe.setRefreshBookStacks(false)
  }
})

const addBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: groupId.value,
    name: '新建分组'
  }
  let res = await addBookStacksApi(params)
  if (res.code === 1000) {
    emit('getBookStacks')
    ElMessage.success('新建分组成功')
  }
}

const deleteBookStacks = async (id) => {
  const params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await deleteBookStacksApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    emit('getBookStacks')
  } else {
    ElMessage.error(res.msg)
  }
}

const getLibrary = async (id) => {
  const params = {
    space: spaceId.value,
    group: groupId.value,
    stacks: id
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    return res.data
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
      grouping: true
    })
  }
  return []
}

const toAddGroup = () => {
  addBookStacks()
}

const toAddLibrary = (val: string) => {
  isShowsLibraryDialog.value = true
  stackId.value = val
}

const toDeleteGroup = (val) => {
  if (val.is_default === '1') return
  deleteBookStacks(val.id)
}

const startEditing = (val: any) => {
  editedName.value = val.name // 将当前名称放入输入框中
  processedGroup.value.map((item) => {
    if (item.id === val.id) {
      item.is_editing = true
    } else {
      item.is_editing = false
    }
  })
}

const stopEditing = (val: any) => {
  blur()
  if (editedName.value !== val.name) {
    editBookStacks(val)
  }
}

const blur = () => {
  processedGroup.value.map((item) => {
    item.is_editing = false
  })
}

const focus = (e) => {
  e.target.select()
}

// 修改分组名称
const editBookStacks = async (val: any) => {
  const params = {
    space: val.space,
    group: val.group,
    name: editedName.value
  }
  let res = await editBookStacksApi(val.id, params)
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    emit('getBookStacks')
  }
}

const toMoveGroup = (val: any) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toExistLibrary = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}
</script>

<template>
  <div class="LibraryTable_wrap" v-for="(item, index) in processedGroup" :key="'props' + index">
    <div class="header">
      <div class="name" v-if="!item.is_editing">
        <span @click="startEditing(item)">{{ item.name }}</span>
      </div>
      <el-input class="editName" v-else v-model="editedName" placeholder="" autofocus maxlength="40" @change="stopEditing(item)" @focus="focus($event)" @blur="blur" />
      <div class="right">
        <div class="divider"></div>
        <div class="operation">
          <LibraryOperationPopver
            :menuItems="infoStore.currentSidebar === 'Sidebar' ? addLibraryOperation : addOperation"
            placement="bottom-end"
            trigger="hover"
            :showAfter="600"
            :width="140"
            :height="32"
            @addGroup="toAddGroup"
            @addLibrary="toAddLibrary(item.id)"
            @addExistLibrary="toExistLibrary"
          >
            <span class="item"><img src="/src/assets/icons/addIcon.svg" alt="" class="moreIcon" /></span>
          </LibraryOperationPopver>
          <el-tooltip effect="dark" :content="processedGroup.length === 1 ? '分组唯一，无法移动' : '向上移动'" placement="top" :show-arrow="false">
            <span :class="['item', 'upIcon', processedGroup.length === 1 ? 'is_disabled' : '']" v-if="props.showDelete" @click="toMoveGroup(item)">
              <img v-if="processedGroup.length === 1" src="/src/assets/icons/downIcon_disabled.svg" alt="" />
              <img v-else src="/src/assets/icons/downIcon.svg" alt="" />
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="processedGroup.length === 1 ? '分组唯一，无法移动' : '向下移动'" placement="top" :show-arrow="false">
            <span :class="['item', processedGroup.length === 1 ? 'is_disabled' : '']" v-if="props.showDelete" @click="toMoveGroup(item)">
              <img v-if="processedGroup.length === 1" src="/src/assets/icons/downIcon_disabled.svg" alt="" />
              <img v-else src="/src/assets/icons/downIcon.svg" alt="" />
            </span>
          </el-tooltip>
          <el-popconfirm
            width="232"
            confirm-button-text="确定"
            cancel-button-text="取消"
            confirm-button-type="success"
            :icon="WarningFilled"
            icon-color="#ecaa04"
            title="删除后，该分组下的知识库将移动到【默认分组】"
            @confirm="toDeleteGroup(item)"
          >
            <template #reference>
              <div>
                <el-tooltip effect="dark" content="删除分组" placement="top" :show-arrow="false">
                  <span class="item" v-if="props.showMove && item.is_default !== '1'">
                    <img src="/src/assets/icons/deleteIcon.svg" alt="" />
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-popconfirm>
          <el-tooltip effect="dark" content="默认分组，无法删除" placement="top" :show-arrow="false">
            <span :class="['item', 'is_disabled']" v-if="props.showMove && item.is_default === '1'">
              <img src="/src/assets/icons/deleteIcon_disabled.svg" alt="" />
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="content">
      <LibraryCard :cardList="item.library" :stackId="item.id" />
    </div>
  </div>
  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" :stackId="String(stackId)" />
</template>

<style lang="scss" scoped>
.LibraryTable_wrap {
  .header {
    display: flex;
    align-items: center;
    height: 40px;
    position: relative;
    margin-bottom: 8px;
    padding-top: 8px;
    .name {
      :hover {
        border-bottom: 1px solid #00b96b;
      }
    }
    .editName {
      width: 170px;
      ::selection {
        background-color: #d1ecf9;
        color: #262626;
      }
    }
    span {
      font-size: 14px;
      min-width: 10px;
      color: #262626;
    }
    .right {
      flex: 1;
      display: none;
      align-items: center;
      .divider {
        flex: 1;
        margin-left: 8px;
        height: 1px;
        background: #e7e9e8;
      }
      .operation {
        height: 32px;
        border-radius: 6px;
        padding: 4px;
        border: 1px solid #e7e9e8;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        margin-left: 8px;

        box-sizing: border-box;
        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          &:not(:last-child) {
            margin-right: 4px;
          }
          &:hover {
            background-color: #eff0f0;
          }
        }
        .upIcon {
          transform: rotate(180deg);
        }
        .is_disabled {
          &:hover {
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 0 0 0 -16px;
  }
  &:hover {
    .right {
      display: flex;
    }
  }
}
</style>

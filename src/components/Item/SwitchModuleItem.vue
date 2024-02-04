<script lang="ts" setup>
import { addBookStacksApi } from '@/api/bookstacks'

interface Button {
  type: string
  name: string
}

type ModuleType = 'operation' | 'search'

const props = defineProps<{
  moduleType?: ModuleType
  moduleGenreData?: Button[]
  moduleGenre?: string
}>()
const emit = defineEmits(['getBookStacks', 'changeModule'])

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const spaceId = ref('') // 当前空间id
const groupId = ref('') // 当前团队id
const moduleGenreLocal = ref(props.moduleGenre)
const isShowsLibraryDialog = ref(false)
const viewType = ref('group')
const addOperation = [
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

watchEffect(() => {
  spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : infoStore.currentQuery?.sid
  groupId.value = infoStore.currentSpaceType === '个人' ? localStorage.getItem('personalGroupId') : infoStore.currentQuery?.gid
})

const changeType = (type: string) => {
  if (moduleGenreLocal.value === type) return
  moduleGenreLocal.value = type
  emit('changeModule', type)
}

const toChangeView = (type: string) => {
  if (viewType.value === type) return
  viewType.value = type
  ElMessage.warning('功能暂未开放，敬请期待')
  viewType.value = 'group'
}

// 新建知识库分组
const toAddGroup = () => {
  addBookStacks()
}

const addBookStacks = async () => {
  const params = {
    name: '新建分组',
    space: spaceId.value,
    group: groupId.value
  }
  let res = await addBookStacksApi(params)
  if (res.code === 1000) {
    emit('getBookStacks')
    // fix 公共区下新建分组不刷新
    infoStore.currentQuery.gname && infoStore.currentQuery.gname === '公共区' && refreshStroe.setRefreshPublicBookStacks(true)
    ElMessage.success('新建分组成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const toAddLibrary = () => {
  isShowsLibraryDialog.value = true
}
</script>

<template>
  <div class="SwitchModuleItem-wrap">
    <slot name="left">
      <div class="module-button">
        <label v-for="item in props.moduleGenreData" :key="item.type" :class="[moduleGenreLocal === item.type ? 'module-active' : '']" @click="changeType(item.type)">
          {{ item.name }}
        </label>
      </div>
    </slot>
    <slot name="right">
      <div class="module-operation" v-if="props.moduleType === 'operation'">
        <LibraryOperationPopver
          :menuItems="addOperation"
          placement="bottom-end"
          trigger="hover"
          :showAfter="600"
          :width="140"
          :height="32"
          @addGroup="toAddGroup"
          @addLibrary="toAddLibrary()"
        >
          <div class="addIcon">
            <img src="/src/assets/icons/addIcon.svg" alt="" class="moreIcon" />
            <img src="/src/assets/icons/downIcon.svg" alt="" />
          </div>
        </LibraryOperationPopver>
        <div class="styleIcon">
          <el-tooltip effect="dark" content="分组视图" placement="top" :show-arrow="false">
            <span :class="[viewType === 'group' ? 'is_selected' : '']" @click="toChangeView('group')">
              <img src="/src/assets/icons/cardStyleIcon.svg" alt="" class="moreIcon" />
            </span>
          </el-tooltip>
          <div class="divider"></div>
          <el-tooltip effect="dark" content="列表视图" placement="top" :show-arrow="false">
            <span :class="[viewType === 'list' ? 'is_selected' : '']" @click="toChangeView('list')">
              <img src="/src/assets/icons/listStyleIcon.svg" alt="" />
            </span>
          </el-tooltip>
        </div>
      </div>
      <div class="module-search" v-if="props.moduleType === 'search'">
        <div class="search-item">
          <span>类型 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
        </div>
        <div class="search-item">
          <span>归属 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
        </div>
        <div class="search-item">
          <span>创建者 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
        </div>
      </div>
    </slot>
  </div>

  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
</template>

<style lang="scss" scoped>
.SwitchModuleItem-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .module-button {
    padding: 3px;
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      border-radius: 6px;
      min-height: 28px;
      padding: 2px 16px;
      cursor: pointer;
      text-align: center;
      line-height: 28px;
      transition: background-color 0.3s, color 0.3s;
    }
  }
  .module-operation {
    height: 32px;
    display: flex;
    align-items: center;
    .addIcon {
      margin-left: 12px;
      height: 32px;
      width: 64px;
      border-radius: 6px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      line-height: 32px;
      border: 1px solid #e7e9e8;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        border-color: #009456;
      }
      img {
        width: 16px;
        height: 16px;
        margin-top: 7px;
      }
    }
    .styleIcon {
      display: flex;
      align-items: center;
      margin-left: 12px;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        width: 26px;
        height: 26px;
        &:hover {
          background-color: #eff0f0;
        }
      }
      .is_selected {
        background-color: #eff0f0;
      }
      div {
        display: flex;
        align-items: center;
        border-right: 1px solid #e7e9e8;
        height: 16px;
        position: relative;
        margin: 0 5px;
      }
    }
  }
  .module-active {
    background-color: #fff;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 1px rgba(0, 0, 0, 0.02);
  }
  .module-search {
    display: flex;
    align-items: center;
    .search-item {
      display: flex;
      align-items: center;
      margin-left: 8px;
      span {
        font-size: 14px;
        color: #585a5a;
        padding: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>

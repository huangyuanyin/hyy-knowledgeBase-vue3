<script lang="ts" setup>
import { getArticleTreeApi } from '@/api/article'
import { getGroupsApi } from '@/api/groups'
import { getLibraryApi } from '@/api/library'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const visible = ref(false)
const dataSource = ref([]) // 目录树
const bookId = ref('') // 知识库id
const spaceId = ref(route.query.sid) // 当前空间id
const selectTeamValue = ref('')
const selectTeamName = ref('')
const teamList = ref([])
const selectLibarayValue = ref('')
const libarayList = ref([])

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    visible.value = newVal
    if (visible.value) {
      await getGroups()
      getArticle()
    }
  }
)

const closeDialog = () => {
  visible.value = false
  emit('closeDialog', false)
}

// 获取目录
const getArticle = async () => {
  const params = {
    book_id: bookId.value || ('1' as string)
  }
  let res = await getArticleTreeApi(params)
  if (res.code === 1000) {
    dataSource.value = res.data || ([] as any)
  }
}

// 获取团队列表
const getGroups = async () => {
  const params = {
    space: spaceId.value
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    teamList.value = res.data || ([] as any)
    teamList.value.map((it) => {
      if (it.is_default === '1') {
        selectTeamValue.value = it.id
        selectTeamName.value = it.groupname
        return
      }
    })
    if (selectTeamValue.value) {
      getLibrary()
    }
  }
}

// 获取知识库列表
const getLibrary = async () => {
  const params = {
    group: selectTeamValue.value
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    libarayList.value = res.data || ([] as any)
    selectLibarayValue.value = String(route.query.lid)
  }
}
</script>

<template>
  <el-dialog class="moveDialog" v-model="visible" width="600px" align-center @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header">
        <h6 :id="titleId" :class="titleClass">移动到...</h6>
      </div>
    </template>
    <p>可移动到有创建文档权限的知识库</p>
    <div class="body">
      <div class="select">
        <el-select v-model="selectTeamValue" placement="bottom-start" popper-class="selectList">
          <template #prefix>
            <img v-if="selectTeamName === '公共区'" class="prefix-icon" src="/src/assets/icons/library/publicIcon.svg" />
            <img v-else class="prefix-icon" src="/src/assets/icons/teamIcon.svg" />
          </template>
          <el-option v-for="(item, index) in teamList" :key="'teamList' + index" :label="item.groupname" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" :src="item.icon || item.is_default === '1' ? '/src/assets/icons/library/publicIcon.svg' : '/src/assets/icons/teamIcon.svg'" alt="" />
              <span>{{ item.groupname }}</span>
            </div>
            <img v-if="item.id === selectTeamValue" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
        <span class="line"> / </span>
        <el-select v-model="selectLibarayValue" popper-class="selectList" placement="bottom-start">
          <template #prefix>
            <img class="prefix-icon" src="/src/assets/icons/bookIcon.svg" />
          </template>
          <el-option v-for="(item, index) in libarayList" :key="'libarayList' + index" :label="item.name" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" :src="item.icon || '/src/assets/icons/bookIcon.svg'" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <img v-if="item.id === selectLibarayValue" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
      </div>
      <div class="list">
        <div class="list-header">
          <span>请选择要放置的目录位置</span>
          <div class="list-button">
            <el-tooltip effect="dark" content="置顶" placement="top" :show-arrow="false">
              <span>
                <img src="/src/assets/icons/article/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="置底" placement="top" :show-arrow="false">
              <span class="pinDown">
                <img src="/src/assets/icons/article/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="content">
          <el-tree
            :data="dataSource"
            node-key="id"
            :current-node-key="Number(route.query.aid)"
            :props="{ class: 'articleList' }"
            default-expand-all
            highlight-current
            @node-click="toArticleDetail"
          >
            <template #default="{ node, data }">
              <span class="list-node">
                <div class="title">
                  <div :class="['icon', !data.children?.length ? 'no-icon' : '']">
                    <img src="/src/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && node.expanded" />
                    <img class="foldIcon" src="/src/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && !node.expanded" />
                  </div>
                  <span>{{ data.title }}</span>
                </div>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.moveDialog {
  border-radius: 8px;
  h6 {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 0;
  }
  p {
    margin-bottom: 16px;
    font-weight: 400;
    font-size: 14px;
    color: #585a5a;
  }
  .select {
    margin-bottom: 25px;
    .el-select {
      width: 160px;
      height: 32px;
      font-size: 14px;
      border-radius: 6px;
      .select-trigger {
        border-radius: 6px;
        height: 32px;
      }
    }
    .line {
      margin: 0px 12px;
      line-height: 32px;
    }
  }
  .list {
    &-header {
      color: #262626;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      .list-button {
        display: flex;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          margin-left: 8px;
          cursor: pointer;
          img {
            width: 9px;
            min-width: 9px;
            height: 13px;
          }
          &:hover {
            background-color: #e7e9e8;
            border-radius: 2px;
          }
        }
        .pinDown {
          img {
            transform: rotate(180deg);
          }
        }
      }
    }
    .content {
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #262626;
      font-size: 14px;
      font-variant: tabular-nums;
      list-style: none;
      font-feature-settings: 'tnum';
      background: #fff;
      border-radius: 6px;
      height: 326px;
      overflow: hidden auto;
      .articleList {
        .el-tree-node__content {
          border-radius: 4px;
        }
      }
    }
  }
}
.selectList {
  li {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    width: 280px;
    .icon {
      width: 24px !important;
      height: 24px !important;
      margin-right: 12px !important;
    }
  }
}
</style>

<script lang="ts" setup>
import { getArticleTreeApi } from '@/api/article'
import { getGroupsApi } from '@/api/groups'
import { getLibraryApi } from '@/api/library'
import { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const visible = ref(false)
const spaceId = ref(null) // 当前空间id
const teamId = ref(null) // 团队id
const bookId = ref(null) // 知识库id
const articleId = ref(null) // 文章id
const dataSource = ref([]) // 目录树
const selectTeamName = ref('')
const teamList = ref([])
const bookList = ref([])
const pinPosition = ref('0') // 0：置顶 1：选中 2：置底
const levelType = ref('2') // 1：同级 2：子级
const treeProps = {
  class: 'articleList',
  disabled: 'disabled'
} as unknown as TreeOptionProps

watch(
  () => props.show,
  async (newVal: boolean) => {
    visible.value = newVal
    if (visible.value) {
      await initData()
      await getTeams()
      await getBook()
    }
  }
)

const initData = () => {
  spaceId.value = props.data.space
  teamId.value = Number(route.query.gid)
  bookId.value = props.data.book
  articleId.value = null
  pinPosition.value = '0'
}

const changePip = (val) => {
  if (!dataSource.value.length) return
  articleId.value = null
  pinPosition.value = val
}

const toSelectArticle = (val) => {
  if (val.disabled) return
  pinPosition.value = '1'
  articleId.value = val.id
  levelType.value = '2'
}

const closeDialog = () => {
  visible.value = false
  emit('closeDialog', false)
}

const toSubmit = () => {}

const toChange = (type) => {
  console.log(`output->`, teamId.value)
  pinPosition.value = '0'
  levelType.value = '2'
  articleId.value = null
  if (type === 'team') {
    bookId.value = null
    getBook()
  } else {
    getArticle()
  }
}

// 获取目录
const getArticle = async () => {
  let res = await getArticleTreeApi(bookId.value)
  if (res.code === 1000) {
    dataSource.value = res.data || ([] as any)
    if (props.title === '移动到...') {
      const { disableNodeAndChildren } = useTreeDisable(dataSource.value)
      disableNodeAndChildren(props.data.id)
    }
  }
}

// 获取团队列表
const getTeams = async () => {
  const params = {
    space: spaceId.value as string
  }
  let res = await getGroupsApi(params)
  if (res.code === 1000) {
    teamList.value = res.data || ([] as any)
  }
}

// 获取知识库列表
const getBook = async () => {
  const params = {
    group: String(teamId.value)
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    bookList.value = res.data || ([] as any)
    if (teamId.value !== Number(route.query.gid)) {
      bookId.value = bookList.value.length > 0 ? bookList.value[0].id : null
    } else {
      bookId.value = props.data.book
    }
    if (bookId.value === null) return (dataSource.value = [])
    getArticle()
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
      grouping: true
    })
  }
}
</script>

<template>
  <el-dialog class="moveDialog" v-model="visible" width="600px" align-center @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header">
        <h6 :id="titleId" :class="titleClass">{{ props.title }}</h6>
      </div>
    </template>
    <p>{{ props.desc }}</p>
    <div class="body">
      <div class="select">
        <el-select v-model="teamId" placement="bottom-start" popper-class="selectList" @change="toChange('team')">
          <template #prefix>
            <img v-if="selectTeamName === '公共区'" class="prefix-icon" src="/src/assets/icons/library/publicIcon.svg" />
            <img v-else class="prefix-icon" src="/src/assets/icons/teamIcon.svg" />
          </template>
          <el-option v-for="(item, index) in teamList" :key="'teamList' + index" :label="item.groupname" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" :src="item.icon || item.is_default === '1' ? '/src/assets/icons/library/publicIcon.svg' : '/src/assets/icons/teamIcon.svg'" alt="" />
              <span>{{ item.groupname }}</span>
            </div>
            <img v-if="item.id === teamId" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
        <span class="line"> / </span>
        <el-select v-model="bookId" popper-class="selectList" placement="bottom-start" @change="toChange('book')">
          <template #prefix>
            <img class="prefix-icon" src="/src/assets/icons/bookIcon.svg" />
          </template>
          <el-option v-for="(item, index) in bookList" :key="'bookList' + index" :label="item.name" :value="item.id">
            <div style="display: flex; align-items: center">
              <img class="icon" :src="item.icon || '/src/assets/icons/bookIcon.svg'" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <img v-if="item.id === bookId" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
          </el-option>
        </el-select>
      </div>
      <div class="list">
        <div class="list-header">
          <span>请选择要放置的目录位置</span>
          <div class="list-button">
            <el-tooltip effect="dark" content="置顶" placement="top" :show-arrow="false">
              <span @click="changePip('0')">
                <img src="/src/assets/icons/article/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="置底" placement="top" :show-arrow="false">
              <span class="pinDown" @click="changePip('2')">
                <img src="/src/assets/icons/article/pinTopIcon.svg" alt="" />
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="content">
          <div class="pinTop" v-if="pinPosition === '0'">
            <img src="/src/assets/icons/caretIcon.svg" alt="" />
            <div class="line"></div>
          </div>
          <el-tree
            :data="dataSource"
            node-key="id"
            :props="treeProps"
            :current-node-key="articleId"
            :expand-on-click-node="false"
            empty-text="插入第一个目录节点"
            default-expand-all
            highlight-current
            @node-click="toSelectArticle"
          >
            <template #default="{ data }">
              <span class="list-node" :class="[data.disabled ? 'disabled' : '']">
                <div class="title">
                  <span class="maxSpan" v-if="articleId === data.id && pinPosition === '1'">{{ data.title }}</span>
                  <span v-else>{{ data.title }}</span>
                </div>
                <div class="button" v-if="articleId === data.id">
                  <span>移动为</span>
                  <div>
                    <el-radio-group v-model="levelType" class="radio-group">
                      <el-radio label="1">同级</el-radio>
                      <el-radio label="2">子级</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="pin" :class="[levelType === '2' ? 'childrenPip' : '']" v-if="articleId === data.id && pinPosition === '1'">
                  <img src="/src/assets/icons/caretIcon.svg" alt="" />
                  <div class="line"></div>
                </div>
              </span>
            </template>
          </el-tree>
          <div class="pinDown" v-if="pinPosition === '2'">
            <img src="/src/assets/icons/caretIcon.svg" alt="" />
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="success" @click="toSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.moveDialog {
  border-radius: 8px;
  .el-dialog__body {
    padding-top: 0px;
  }
  .el-dialog__header {
    padding-bottom: 0px;
  }
  h6 {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  p {
    margin-bottom: 20px;
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
      position: relative;
      .articleList {
        .el-tree-node__content {
          border-radius: 4px;
          margin-bottom: 4px;
          width: 100%;
          box-sizing: border-box;
        }
      }
      .el-tree {
        max-height: 326px;
        overflow: auto;
        .list-node {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 23px;
          position: relative;
          .title {
            span {
              white-space: nowrap;
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .maxSpan {
              width: 275px;
            }
          }
          .button {
            display: flex;
            align-items: center;
            span {
              color: #8a8f8d;
            }
            .radio-group {
              margin-left: 8px;
              margin-right: 8px;
              .el-radio {
                margin-right: 8px;
                margin-left: 0px;
                .el-radio__label {
                  color: #262626;
                  margin-left: 4px;
                  margin-right: 4px;
                  padding: 0;
                }
              }
            }
          }
          .pin {
            position: absolute;
            display: flex;
            align-items: center;
            bottom: -10px;
            left: -16px;
            width: 100%;
            svg {
              width: 13px;
              min-width: 13px;
              height: 6px;
            }
            .line {
              margin-left: 4px;
              width: 100%;
              height: 1px;
              background-color: #117cee;
            }
          }
          .childrenPip {
            left: 16px !important;
            width: calc(100% - 32px);
          }
        }
      }
      .pinTop {
        width: 100%;
        max-width: 500px;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0px;
        left: 16px;
        .line {
          margin-left: 4px;
          width: 100%;
          height: 1px;
          background-color: #117cee;
        }
        svg {
          width: 13px;
          min-width: 13px;
          height: 6px;
        }
      }
      .pinDown {
        width: 100%;
        max-width: 500px;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 4px;
        left: 16px;
        .line {
          margin-left: 4px;
          width: 100%;
          height: 1px;
          background-color: #117cee;
        }
        svg {
          width: 13px;
          min-width: 13px;
          height: 6px;
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

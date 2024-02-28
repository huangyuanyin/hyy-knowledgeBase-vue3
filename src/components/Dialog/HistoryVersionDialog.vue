<script lang="ts" setup>
import back2Icon from '@/assets/icons/back2.svg'
import editIcon from '@/assets/icons/editIcon.svg'
import deleteIcon from '@/assets/icons/deleteIcon.svg'
import emptyImg from '@/assets/img/empty.png'
import { WarningFilled } from '@element-plus/icons-vue'
import { deleteArticleVersionApi, editArticleVersionApi, getArticleVersionApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean,
  info: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const router = useRouter()
const refreshStore = useRefreshStore()
const dialogVisible = ref(false)
const tabName = ref('version')
const versionList = ref([])
const selectVersion = ref({
  id: null,
  body: '',
  name: '',
  type: ''
})
const temIframe = ref(null)
const iframeSrc = ref('')
const versionName = ref(null)
const reNameId = ref(null)
const reName = ref('')

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    versionList.value = []
    if (newVal) {
      getArticleVersion(props.info.id)
    }
  }
)

watch(
  () => selectVersion.value,
  () => {
    if (selectVersion.value.type === 'ppt') {
      iframeSrc.value = `${import.meta.env.VITE_BASE_PPT_URL}?timestamp=` + Date.now()
    } else if (selectVersion.value.type === 'mind') {
      iframeSrc.value = `${import.meta.env.VITE_BASE_MINDMAP_URL}?timestamp=` + Date.now()
    }
    nextTick(() => {
      sendMessageToIframe(selectVersion.value.body)
    })
  },
  {
    deep: true,
    immediate: true
  }
)

const sendMessageToIframe = (data) => {
  const type = selectVersion.value.type === 'mind' ? 'getData' : 'getPPTData'
  if (temIframe.value) {
    temIframe.value.onload = () => {
      temIframe.value.contentWindow.postMessage({ type, data, isPreview: true }, '*')
    }
  }
}

const toChangeVersion = (item) => {
  selectVersion.value = item
}

const deleteArticleVersion = async (id) => {
  let res = await deleteArticleVersionApi(id)
  if (res.code === 1000) {
    ElMessage.success('该版本已删除')
    getArticleVersion(props.info.id)
  } else {
    ElMessage.error(res.msg)
  }
}

const getArticleVersion = async (id) => {
  const params = { content: id }
  let res = await getArticleVersionApi(params)
  if (res.code === 1000) {
    versionList.value = res.data as any
    selectVersion.value = res.data[0]
  } else {
    ElMessage.error(res.msg)
  }
}

const toRecoverVersion = async () => {
  const status = route.path.split('/').slice(-1)[0]
  await handleClose()
  router.push({
    path: status === 'edit' ? route.path : `${route.path}edit`,
    query: {
      ...route.query
    }
  })
  sessionStorage.setItem('recoverVersion', selectVersion.value.body)
  refreshStore.setRefreshMind(true)
}

const isreload = ref(false)

const handleClose = async () => {
  isreload.value = true
  dialogVisible.value = false
  emit('closeDialog', false)
}

const toEditName = (val) => {
  reNameId.value = val.id
  reName.value = val.name
}

const handleRename = async (val) => {
  if (reName.value === '') {
    ElMessage.error('版本名称不能为空')
    return
  }
  const params = {
    name: reName.value,
    type: val.type,
    content: val.content
  }
  let res = await editArticleVersionApi(reNameId.value, params)
  if (res.code === 1000) {
    ElMessage.success('修改成功')
    getArticleVersion(props.info.id)
  } else {
    ElMessage.error(res.msg)
  }
  reNameId.value = null
}
</script>

<template>
  <el-dialog class="HistoryVersionDialog" v-model="dialogVisible" width="368" fullscreen :show-close="false" :before-close="handleClose">
    <template #title>
      <div class="header">
        <div class="left">
          <img :src="back2Icon" alt="" @click="handleClose" />
          <span>历史版本</span>
        </div>
        <div class="right">
          <el-button :class="[!versionList.length ? 'disabled' : '']" :disabled="!versionList.length || selectVersion.body === ''" @click="toRecoverVersion">恢复此版本</el-button>
        </div>
      </div>
    </template>
    <div class="box">
      <div class="list">
        <el-tabs v-model="tabName" class="demo-tabs">
          <el-tab-pane label="版本" name="version">
            <template v-if="versionList.length">
              <div v-for="item in versionList" class="list-item" :class="[selectVersion.id === item.id ? 'selected' : '']" @click="toChangeVersion(item)">
                <div v-if="reNameId !== item.id" class="name">{{ item.name }}</div>
                <input
                  @click.stop
                  class="editTitle"
                  ref="versionName"
                  v-if="reNameId === item.id"
                  v-model="reName"
                  type="text"
                  @blur.stop="handleRename(item)"
                  @keyup.enter.stop="handleRename(item)"
                />
                <div>{{ item.update_datetime }}</div>
                <div class="creator">
                  <div>{{ item.modifier_name }}</div>
                  <div class="opera">
                    <el-tooltip effect="dark" content="修改版本名称" placement="top" :show-arrow="false">
                      <span @click.stop="toEditName(item)"><img :src="editIcon" alt="" /></span>
                    </el-tooltip>
                    <el-popconfirm
                      width="220"
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      :icon="WarningFilled"
                      icon-color="#ecaa04"
                      title="确认删除这个版本吗？"
                      @confirm="deleteArticleVersion(item.id)"
                    >
                      <template #reference>
                        <span @click.stop><img :src="deleteIcon" alt="" /></span>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-version">
                <img :src="emptyImg" alt="" />
                <span>暂无版本记录</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="preview" v-if="selectVersion">
        <MavonEditor v-if="selectVersion.type === 'doc'" :html="selectVersion.body" :navigation="false" />
        <Excel v-if="selectVersion.type === 'sheet'" :body="selectVersion.body" :isPreview="true" :isTem="Date.now()" :isreload="isreload" />
        <iframe
          v-if="['ppt', 'mind'].includes(selectVersion.type)"
          class="iframe"
          ref="temIframe"
          :src="iframeSrc"
          frameborder="0"
          width="100%"
          height="100%"
          allowfullscreen="true"
        ></iframe>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.HistoryVersionDialog {
  border-radius: 8px;
  overflow: hidden !important;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    box-shadow: 0 2px 6px 0 rgba(7, 74, 146, 0.06);
    padding: 12px 24px;
    box-sizing: border-box;
    position: relative;

    .left {
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        cursor: pointer;
      }
      span {
        font-size: 16px;
        font-weight: 700;
      }
    }
    .right {
      .el-button {
        border: none;
        color: #fff;
        background-color: #00b968;
        &:hover {
          background-color: #009456;
        }
      }
      .disabled {
        background-color: #b2ead2 !important;
        color: #fff !important;
        &:hover {
          background-color: #b2ead2 !important;
        }
      }
    }
  }
  .box {
    height: calc(100vh - 56px);
    display: flex;
    align-items: center;
    overflow: hidden;
    .list {
      width: 310px;
      height: 100%;
      border-right: 1px solid #e7e9e8;
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
      }
      .list-item {
        padding: 8px 24px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        cursor: pointer;
        .name {
          font-size: 14px;
          color: #262626;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .editTitle {
          border-radius: 6px;
          border: 1px solid #00b96b;
          box-shadow: none;
          height: 24px;
          outline: none;
          padding: 1px 6px;
          box-sizing: border-box;
        }
        div {
          font-size: 12px;
          color: #8a8f8d;
          line-height: 18px;
        }
        .creator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .opera {
            display: none;
            align-items: center;
            span {
              cursor: pointer;
              margin-left: 16px;
              img {
                width: 14px;
                height: 14px;
              }
            }
          }
        }
        &:hover {
          .opera {
            display: flex;
          }
        }
      }
      .selected {
        background-color: #f4f5f5;
        .opera {
          display: flex !important;
        }
      }
      .no-version {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 128px;
        img {
          width: 140px;
          height: 82px;
          margin-bottom: 16px;
        }
        span {
          font-size: 14px;
          color: #8a8f8d;
        }
      }
    }
    .preview {
      width: 100%;
      height: 100%;
      .mavon-editor {
        height: 100%;
        .mavon-editor-preview {
          padding: 0;
          .markdown-body {
            padding: 0;
          }
        }
      }
      .MavonEditor_wrap {
        margin-top: 10px;
        .v-note-show {
          padding-right: 0;
        }
      }
    }
  }
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body,
  .el-dialog__header {
    margin-right: 0px;
    padding: 0px !important;
  }
  .el-form-item {
    margin-bottom: 24px;
    border-radius: 6px;
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 36px;
    border-radius: 6px;
  }
  .prefix-icon {
    width: 20px;
    height: 20px;
  }
  .form-description {
    margin-bottom: 18px;
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>

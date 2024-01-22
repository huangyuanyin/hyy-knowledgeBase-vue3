<script lang="ts" setup>
import temIcon from '@/assets/icons/temIcon.svg'
import closeIcon from '@/assets/icons/closeIcon.svg'
import emptyImg from '@/assets/img/empty-tem.png'
// import more2Icon from '@/assets/icons/more2.svg'
import deleteIcon from '@/assets/icons/deleteIcon.svg'
import { addArticleApi, getArticleTemApi, deleteArticleTemApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const dialogVisible = ref(false)
const templateType = ref('null')
const temList = ref([])
const iframeSrc = ref('')
const temIframe = ref(null)
const selectTem = ref({
  id: null,
  body: '',
  name: '',
  content_type: ''
})
const temRange = ref([
  { label: '推荐', desc: '仅在本空间中可以使用', value: 'null' },
  { label: '本空间', desc: '仅在本空间中可以使用', value: '3' },
  { label: '本团队', desc: '仅在本团队中可以使用', value: '2' },
  { label: '本知识库', desc: '仅在本知识库中可以使用', value: '1' },
  { label: '我的', desc: '可以在你参与的所有知识库中使用', value: '0' }
])

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      getArticleTem({ template_type: 'template' })
    }
  }
)

watch(
  () => selectTem.value,
  (newVal) => {
    if (newVal.content_type === 'ppt') {
      iframeSrc.value = `${import.meta.env.VITE_BASE_PPT_URL}?timestamp=` + Date.now()
    } else if (newVal.content_type === 'mind') {
      iframeSrc.value = `${import.meta.env.VITE_BASE_MINDMAP_URL}?timestamp=` + Date.now()
    }
    nextTick(() => {
      sendMessageToIframe(selectTem.value.body)
    })
  },
  {
    deep: true,
    immediate: true
  }
)

const handleClick = (tab) => {
  templateType.value = tab
  const params = {
    template_type: 'user',
    target_type: tab,
    target_id: null
  }
  switch (tab) {
    case 'null':
      getArticleTem({ template_type: 'template' })
      break
    case '0':
    case '1':
    case '2':
    case '3':
      const idParam = tab !== '0' ? Number(route.query[`${tab === '1' ? 'l' : tab === '2' ? 'g' : 's'}id`]) : null
      params.target_id = idParam
      getArticleTem(params)
      break
  }
}

const getArticleTem = async (params) => {
  const res = await getArticleTemApi(params)
  if (res.code === 1000) {
    temList.value = res.data as any
    selectTem.value = temList.value[0] || {}
  } else {
    ElMessage.error(res.msg)
  }
}

const sendMessageToIframe = (data) => {
  const type = selectTem.value.content_type === 'mind' ? 'getData' : 'getPPTData'
  if (temIframe.value) {
    temIframe.value.onload = () => {
      temIframe.value.contentWindow.postMessage({ type, data, isPreview: true }, '*')
    }
  }
}

const toDeleteTem = async (item) => {
  const res = await deleteArticleTemApi(item.id)
  if (res.code === 1000) {
    ElMessage.success('模板删除成功')
    const params = {
      template_type: item.template_type,
      target_type: item.target_type,
      target_id: item.target_id
    }
    getArticleTem(params)
  } else {
    ElMessage.error(res.msg)
  }
}

const toChangeTem = (item) => {
  selectTem.value = item
}

const toAddArticle = async () => {
  const params = {
    title: selectTem.value.name,
    type: selectTem.value.content_type,
    body: selectTem.value.body,
    parent: null,
    book: route.query.lid as string,
    space: route.query.sid as string,
    public: '1'
  }
  let res = await addArticleApi(params)
  if (res.code === 1000) {
    handleClose()
    useLinkHooks().handleArticleTypeLink(res.data as any, true)
  } else {
    ElMessage.error(res.msg)
  }
}

const isreload = ref(false)

const handleClose = async () => {
  isreload.value = true
  templateType.value = 'null'
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="SelectTemDialog" v-model="dialogVisible" width="1240" :show-close="false" :before-close="handleClose">
    <div class="box">
      <div class="left">
        <MavonEditor v-if="selectTem.content_type === 'doc'" :html="selectTem.body" :navigation="false" />
        <Excel v-if="selectTem.content_type === 'sheet'" :body="selectTem.body" :isPreview="true" :isTem="Date.now()" :isreload="isreload" />
        <iframe
          v-if="['ppt', 'mind'].includes(selectTem.content_type)"
          class="iframe"
          ref="temIframe"
          :src="iframeSrc"
          frameborder="0"
          width="100%"
          height="100%"
          allowfullscreen="true"
        ></iframe>
      </div>
      <div class="right">
        <div class="header">
          <div class="header-left">
            <img :src="temIcon" alt="" />
            <span>模板中心</span>
          </div>
          <img class="closeIcon" :src="closeIcon" alt="" @click="handleClose" />
        </div>
        <div class="tem">
          <el-button :class="[temList.length ? '' : 'disabled']" :disabled="!temList.length" @click="toAddArticle">使用此模板</el-button>
          <el-tabs v-model="templateType" class="template-tabs" @tab-change="handleClick">
            <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in temRange" :key="'temRange' + index">
              <div class="empty" v-if="temList.length === 0">
                <img :src="emptyImg" alt="" />
                <span>暂无模板</span>
              </div>
              <div class="list" v-else>
                <div class="item" :class="[selectTem.id === item.id ? 'selected' : '']" v-for="(item, index) in temList" :key="'temList' + index" @click="toChangeTem(item)">
                  <div>
                    <img :src="item.icon" alt="" />
                    <span>{{ item.name }}</span>
                  </div>
                  <span class="more2Icon" @click.stop="toDeleteTem(item)"><img :src="deleteIcon" alt="" /></span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  .left {
    flex: 1;
    :deep(.MavonEditor_wrap) {
      height: 100%;
      .v-note-wrapper {
        height: 100%;
        border: none;
        max-height: 680px;
        .v-show-content {
          box-sizing: border-box;
          padding: 0 60px;
        }
      }
    }
  }
  .right {
    width: 400px;
    border-left: 1px solid #e7e9e8;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 60px;
      border-bottom: 1px solid #e7e9e8;
      &-left {
        display: flex;
        align-items: center;
        img {
          width: 22px;
          height: 22px;
          margin-right: 8px;
        }
        span {
          font-size: 16px;
        }
      }
      .closeIcon {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    .tem {
      padding: 16px;
      height: 620px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-button {
        background: #00b96b;
        border-color: #00b96b;
        height: 32px;
        border-radius: 6px;
        color: #fff;
        width: 238px;
        span {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        margin-bottom: 16px;
      }
      .disabled {
        background: #afe6cf;
        border-color: #afe6cf;
      }
      .template-tabs {
        height: 100%;
        :deep(.el-tabs__content) {
          height: calc(100% - 55px) !important;
          div {
            height: 100%;
          }
          .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              margin-bottom: 24px;
              width: 60px;
            }
          }
          .list {
            margin-top: 5px;
            .item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 4px;
              box-sizing: border-box;
              height: 38px;
              cursor: pointer;
              width: 100%;
              margin-bottom: 4px;
              div {
                display: flex;
                align-items: center;
                img {
                  width: 22px;
                  height: 22px;
                  margin-right: 12px;
                }
                span {
                  font-size: 14px;
                  color: #262626;
                }
              }
              .more2Icon {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                align-items: center;
                justify-content: center;
                display: none;
                img {
                  width: 16px;
                  height: 16px;
                }
                &:hover {
                  background-color: #d8dad9;
                }
              }
              &:hover {
                background-color: #e7e9e8;
                border-radius: 8px;
                .more2Icon {
                  display: flex;
                }
              }
            }
            .selected {
              background-color: #e7e9e8;
              border-radius: 8px;
              span {
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
}
.luckysheet_wrap {
  height: 100%;
}
</style>

<style lang="scss">
.SelectTemDialog {
  border-radius: 8px;
  height: 680px;
  .el-dialog__body {
    padding: 0px !important;
  }
  .el-dialog__header {
    display: none;
  }
}
</style>

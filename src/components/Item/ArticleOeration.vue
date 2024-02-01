<script lang="ts" setup>
import { articleOperationData, linkOperationData, titleOperationData, fileOperationData } from '@/data/data'
import { useLinkHooks } from '@/hooks/useLink'
import SparkMD5 from 'spark-md5'

interface ArticleData {
  id?: Number
  title: String
  type: String
  [key: string]: any
}

const props = defineProps({
  data: {
    type: Object as PropType<ArticleData>,
    default: () => ({})
  }
})
const emit = defineEmits(['toRename'])

const route = useRoute()
const infoStore = useInfoStore()
const isShowExportFileDialog = ref<boolean>(false)
const isShowLinkDialog = ref<boolean>(false)
const showHandleArticleDialog = ref<boolean>(false)
const handleArticleDialogTitle = ref<string>('')
const handleArticleDialogDesc = ref<string>('')
const handleData = ref<ArticleData>(null) // 复制 || 移动的数据
const exportId = ref<number>(null) // 导出文档的id
const exportType = ref<string>('') // 导出文档的类型
const linkType = ref<string>('') // 编辑链接 | 新增链接
const linkDialogId = ref<number>(null) // 编辑链接的id
const parentId = ref<number>(null) // 编辑链接的父级id

// async function deleteArticle(id: Number) {
//   const { articleList, currentNodeKey: node, handleDeleteArticle } = useArticle()
//   await handleDeleteArticle(id)
//   infoStore.currentArticleTreeInfo = articleList.value
//   // currentNodeKey.value = node.value
// }

// 复制链接
const toCopyLink = (val) => {
  const linkUrl = ref('')
  const spaceName = route.path.split('/')[1]
  if (val.type === 'links') {
    linkUrl.value = val.description
  } else {
    if (val.id == Number(infoStore.currentQuery?.aid)) {
      linkUrl.value = window.location.href
    } else {
      if (infoStore.currentSpaceType === '个人') {
        const query = {
          sid: infoStore.currentQuery?.sid,
          sname: '',
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname,
          aid: val.id,
          aname: val.title
        }
        console.log(`output->query`, JSON.stringify(query))
        const hash = SparkMD5.hash(JSON.stringify(query))
        linkUrl.value = `${window.location.origin}/#/directory/${val.type}?query=${hash}`
      } else {
        const query = {
          sid: infoStore.currentQuery?.sid,
          sname: '',
          gid: infoStore.currentQuery?.gid,
          gname: infoStore.currentQuery?.gname,
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname,
          aid: val.id,
          aname: val.title
        }
        const hash = SparkMD5.hash(JSON.stringify(query))
        linkUrl.value = `${window.location.origin}/#/${spaceName}/directory/${val.type}?query=${hash}`
      }
    }
  }
  useCopy(linkUrl.value)
}

// 复制 || 移动
const toHandleArticle = (type, val) => {
  handleData.value = val
  showHandleArticleDialog.value = true
  if (type === 'move') {
    handleArticleDialogTitle.value = '移动到...'
    handleArticleDialogDesc.value = '可移动到有创建文档权限的知识库'
  } else {
    handleArticleDialogTitle.value = '复制到...'
    handleArticleDialogDesc.value = '可复制到有创建文档权限的知识库'
  }
}

const toDownload = (val) => {
  useArticle().getArticleDetail(val.id, (res) => {
    downloadFile.downloadEvt(res.body, res.title)
  })
}

// 编辑链接弹窗
const toEditLink = (val) => {
  parentId.value = val.parent
  linkType.value = 'edit'
  linkDialogId.value = val.id
  isShowLinkDialog.value = true
}

// 关闭链接弹窗
const closeLinkDialog = () => {
  isShowLinkDialog.value = false
  linkType.value = 'add'
}

// 导出
const toExport = (val) => {
  exportId.value = val.id
  exportType.value = val.type
  isShowExportFileDialog.value = true
}

// 删除
const toDeleteArticle = (val) => {
  useArticle().toDeleteArticle(val)
}

const toTodo = (val) => {
  console.log(`output->val`, val)
  ElMessage.warning('功能暂未开放，敬请期待')
}
</script>

<template>
  <LibraryOperationPopver
    :menuItems="articleOperationData"
    :height="32"
    :width="150"
    @toRename="emit('toRename', props.data)"
    @toEditArticle="
      () => {
        useLinkHooks().handleArticleTypeLink(props.data, true)
      }
    "
    @toCopyLink="toCopyLink(props.data)"
    @toNewTab="
      () => {
        useLinkHooks().handleArticleTypeLink(props.data, false, true)
      }
    "
    @toCopyArticle="toHandleArticle('copy', props.data)"
    @toMoveArticle="toHandleArticle('move', props.data)"
    @toExport="toExport(props.data)"
    @toDeleteArticle="toDeleteArticle(props.data)"
  >
    <span rotate-90 mr-8px inline-flex h-full v-if="props.data.type !== 'links' && props.data.type !== 'title' && props.data.type !== 'file'" @click.stop>
      <slot> <img src="/src/assets/icons/moreIcon1_after.svg" alt="" /> </slot>
    </span>
  </LibraryOperationPopver>
  <LibraryOperationPopver
    :menuItems="linkOperationData"
    :height="32"
    :width="150"
    @toEditLink="toEditLink(props.data)"
    @toCopyLink="toCopyLink(props.data)"
    @toCopyArticle="toHandleArticle('copy', props.data)"
    @toMoveArticle="toHandleArticle('move', props.data)"
    @toTodo="toTodo(props.data)"
    @toDeleteArticle="toDeleteArticle(props.data)"
  >
    <span rotate-90 mr-8px inline-flex h-full v-if="props.data.type === 'links'" @click.stop>
      <slot> <img src="/src/assets/icons/moreIcon1_after.svg" alt="" /> </slot>
    </span>
  </LibraryOperationPopver>
  <LibraryOperationPopver
    :menuItems="titleOperationData"
    :height="32"
    :width="150"
    @toRename="emit('toRename', props.data)"
    @toCopyArticle="toHandleArticle('copy', props.data)"
    @toMoveArticle="toHandleArticle('move', props.data)"
    @toTodo="toTodo(props.data)"
    @toDeleteArticle="toDeleteArticle(props.data)"
  >
    <span rotate-90 mr-8px inline-flex h-full v-if="props.data.type === 'title'" @click.stop>
      <slot> <img src="/src/assets/icons/moreIcon1_after.svg" alt="" /> </slot>
    </span>
  </LibraryOperationPopver>
  <LibraryOperationPopver
    :menuItems="fileOperationData"
    :height="32"
    :width="150"
    @toRename="emit('toRename', props.data)"
    @toExport="toExport(props.data)"
    @toCopyArticle="toHandleArticle('copy', props.data)"
    @toMoveArticle="toHandleArticle('move', props.data)"
    @toDownload="toDownload(props.data)"
    @toDeleteArticle="toDeleteArticle(props.data)"
  >
    <span rotate-90 mr-8px inline-flex h-full v-if="props.data.type === 'file'" @click.stop>
      <slot><img src="/src/assets/icons/moreIcon1_after.svg" alt="" /> </slot>
    </span>
  </LibraryOperationPopver>

  <HandleArticleDialog
    :show="showHandleArticleDialog"
    :title="handleArticleDialogTitle"
    :desc="handleArticleDialogDesc"
    :data="handleData"
    @closeDialog="showHandleArticleDialog = false"
  />
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" :type="linkType" :id="linkDialogId" @closeDialog="closeLinkDialog" />
  <ExportFileDialog :isShow="isShowExportFileDialog" @closeDialog="isShowExportFileDialog = false" :type="exportType" :id="exportId" />
</template>

<style lang="scss" scoped></style>

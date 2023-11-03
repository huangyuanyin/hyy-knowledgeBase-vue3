<template>
  <div id="luckysheet"></div>
</template>

<script lang="ts" setup>
import { editArticleApi } from '@/api/article'
import LuckyExcel from 'luckyexcel'

const props = defineProps({
  isPreview: {
    type: Boolean,
    required: true
  },
  isPublish: {
    type: Boolean,
    required: true
  },
  baseData: {
    type: Object,
    required: false
  }
})

const route = useRoute()
const spaceType = ref('') // 当前空间类型
const previewConfig = {
  container: 'luckysheet',
  showinfobar: false, // 是否显示顶部信息栏
  lang: 'zh', // 中文
  showtoolbar: false, // 是否显示工具栏
  showstatisticBar: false, // 是否显示统计信息栏
  sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
  allowEdit: false, // 是否允许前台编辑
  enableAddRow: false, // 是否允许前台添加行
  enableAddCol: false, // 是否允许前台添加列
  enableAddBackTop: false // 返回顶部按钮
}

const editConfig = {
  container: 'luckysheet',
  showinfobar: false, // 是否显示顶部信息栏
  lang: 'zh' // 中文
}

watchEffect(() => {
  spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
  if (props.isPublish && route.path.split('/').slice(-1)[0] === 'edit') {
    toPublishArticle()
  }
})

watch(
  () => route.path,
  async () => {
    await luckysheet.destroy()
    if (route.path.split('/').slice(-2)[0] == 'sheet') {
      luckysheet.create(props.isPreview ? previewConfig : editConfig)
    }
  }
)

const toPublishArticle = async () => {
  const params = {
    title: props.baseData.title,
    book: props.baseData.book,
    space: props.baseData.space,
    body: JSON.stringify(luckysheet.getAllSheets())
  }
  let res = await editArticleApi(Number(route.query.aid), params)
  if (res.code === 1000) {
    useAddArticleAfterToLink(route, router, spaceType.value, res.data, false)
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  luckysheet.create(props.isPreview ? previewConfig : editConfig)
})
</script>

<style lang="scss" scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: calc(100vh - 52px);
  .luckysheet {
    border: none;
  }
}
</style>

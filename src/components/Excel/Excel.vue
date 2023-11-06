<template>
  <div :id="luckysheetId" class="luckysheet_wrap"></div>
</template>

<script lang="ts" setup>
import { getArticleApi } from '@/api/article'
import { initData } from '@/components/Excel/data'
import LuckySheet from 'luckysheet'

const props = defineProps({
  isPreview: {
    type: Boolean,
    required: true
  },
  body: {
    type: String,
    required: false
  }
})
const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const luckysheetId = ref(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
const excelBody = ref(props.body)
const previewConfig = ref({
  container: luckysheetId.value,
  showinfobar: false, // 是否显示顶部信息栏
  lang: 'zh', // 中文
  data: excelBody.value || '',
  showtoolbar: false, // 是否显示工具栏
  showstatisticBar: false, // 是否显示统计信息栏
  sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
  allowEdit: false, // 是否允许前台编辑
  enableAddRow: false, // 是否允许前台添加行
  enableAddCol: false, // 是否允许前台添加列
  enableAddBackTop: false // 返回顶部按钮
})
const editConfig = ref({
  container: luckysheetId.value,
  showinfobar: false, // 是否显示顶部信息栏
  lang: 'zh', // 中文
  data: excelBody.value || '', // 数据
  hook: {
    updated: function () {
      emit('update:modelValue', JSON.stringify(LuckySheet.getAllSheets()))
    }
  }
})

watch(
  () => route.query.aid,
  async () => {
    if (route.query.aid) {
      await getArticleTree()
      handleCreateSheet()
    }
  }
)

watch(
  () => route.path,
  async () => {
    handleCreateSheet(true)
  }
)

const handleCreateSheet = async (isDestory?: boolean) => {
  if (route.path.split('/').slice(-2)[0] == 'sheet') {
    ;(await isDestory) && LuckySheet.destroy()
    LuckySheet.create(props.isPreview ? previewConfig.value : editConfig.value)
  }
}

const getArticleTree = async () => {
  const res = await getArticleApi(route.query.aid as string)
  if (res.code === 1000) {
    if (res.data.body === '') {
      excelBody.value = JSON.parse(initData)
    } else {
      excelBody.value = JSON.parse(res.data.body) || JSON.parse(initData)
    }
    previewConfig.value.data = excelBody.value
    editConfig.value.data = excelBody.value
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getArticleTree()
  handleCreateSheet(false)
})

onBeforeUnmount(() => {
  LuckySheet.destroy()
})
</script>

<style lang="scss" scoped>
.luckysheet_wrap {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: calc(100vh - 52px);
  .luckysheet {
    border: none;
  }
}
</style>

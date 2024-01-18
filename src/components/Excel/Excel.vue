<template>
  <div :id="luckysheetId" class="luckysheet_wrap"></div>
</template>

<script lang="ts" setup>
import LuckySheet from 'luckysheet'

const props = defineProps({
  isPreview: {
    type: Boolean,
    required: true
  },
  body: {
    type: String,
    required: false
  },
  isTem: {
    type: Number,
    required: false
  },
  isreload: {
    type: Boolean,
    required: false
  }
})
const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const infoStore = useInfoStore()
const luckysheetId = ref(String.fromCharCode(65 + Math.floor(Math.random() * 26)))
const excelBody = ref(props.body)
const previewConfig = ref({
  container: luckysheetId.value,
  showinfobar: false, // 是否显示顶部信息栏
  lang: 'zh', // 中文
  data: excelBody.value,
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
  data: excelBody.value, // 数据
  hook: {
    updated: function () {
      emit('update:modelValue', JSON.stringify(LuckySheet.getAllSheets()))
    }
  }
})

watch(
  () => props.body,
  async () => {
    handleCreateSheet()
  }
)

watch(
  () => route.path,
  async () => {
    handleCreateSheet(true)
  }
)

watch(
  () => props.isTem,
  () => {
    createFromTemLuckysheet()
  }
)

watch(
  () => props.isreload,
  async () => {
    if (infoStore.currentQuery?.aid && route.path.includes('sheet')) {
      window.location.reload()
      handleCreateSheet(true)
    }
  }
)

const createFromTemLuckysheet = () => {
  LuckySheet.destroy()
  excelBody.value = JSON.parse(props.body)
  previewConfig.value.data = excelBody.value
  setTimeout(() => {
    LuckySheet.create(previewConfig.value)
  }, 200)
}

const handleCreateSheet = async (isDestory?: boolean) => {
  if (route.path.split('/').slice(-2)[0] == 'sheet') {
    ;(await isDestory) && LuckySheet.destroy()
    excelBody.value = props.body
    previewConfig.value.data = excelBody.value
    editConfig.value.data = excelBody.value
    LuckySheet.create(props.isPreview ? previewConfig.value : editConfig.value)
  }
}

onMounted(async () => {
  if (!props.isTem) {
    handleCreateSheet(true)
  } else {
    createFromTemLuckysheet()
  }
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

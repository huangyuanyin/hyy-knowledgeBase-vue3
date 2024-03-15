<script lang="ts" setup>
import { watchEffect } from 'vue'
import Container from '../Components/Container.vue'

const emit = defineEmits(['toPublish'])

const route = useRoute()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const sheetIframe = ref(null)
const isPreview = ref(true) // 默认预览模式
const body = ref() // 文章内容
const loading = ref(false) // 是否加载中
const iframeSrc = ref(import.meta.env.VITE_BASE_SHEET_URL)

watchEffect(() => {
  route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
  if (infoStore.currentMenu === 'sheet' && refreshStore.isRefreshSheet) {
    body.value = JSON.parse(sessionStorage.getItem('getSheetData'))
    iframeSrc.value = `${import.meta.env.VITE_BASE_SHEET_URL}?time=' + ${Date.now()}`
  }
})

watch(
  () => infoStore.currentQuery.aid,
  () => {
    sessionStorage.removeItem('getSheetData')
  }
)

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      if (infoStore.currentMenu === 'sheet' && !sessionStorage.getItem('getSheetData')) {
        getArticleTree()
      }
      if (infoStore.currentMenu === 'sheet' && sessionStorage.getItem('getSheetData') && !isPreview.value) {
        body.value = JSON.parse(sessionStorage.getItem('getSheetData'))
      }
    })
  },
  {
    immediate: true
  }
)

const getArticleTree = async () => {
  body.value = ''
  loading.value = true
  sessionStorage.removeItem('getSheetData')
  await useArticle().getArticleDetail(Number(infoStore.currentQuery.aid), (res: any) => {
    if (typeof res === 'string') return
    if (Reflect.ownKeys(res).length) {
      body.value = JSON.parse(res.body)
      sessionStorage.setItem('getSheetData', res.body)
      setTimeout(() => {
        loading.value = false
        // sendMessageToIframe(res.body)
      }, 0)
    }
  })
}

// const sendMessageToIframe = (data) => {
//   if (sheetIframe.value) {
//     sheetIframe.value.onload = () => {
//       sheetIframe.value.contentWindow.postMessage({ type: 'getSheetData', data, isPreview: isPreview.value }, '*')
//     }
//   }
// }

const messageHandler = (event) => {
  const receivedData = event.data
  if (receivedData.type === 'saveSheet') {
    // modelValue.value = JSON.stringify(receivedData.data)
    // isPublish.value = true
  }
}

onMounted(() => {
  sessionStorage.removeItem('getSheetData')
  window.addEventListener('message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<template>
  <div class="Sheet_wrap">
    <Container :content="JSON.stringify(body)" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'">
      <Excel v-if="!isPreview" :body="body" :isPreview="isPreview" />
      <iframe v-if="!loading && isPreview" class="iframe" ref="sheetIframe" :src="iframeSrc" frameborder="0" width="100%" height="100%" allowfullscreen="true"></iframe>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.Sheet_wrap {
  height: 100vh;
  .iframe {
    height: calc(100vh - 52px);
  }
  :deep(.luckysheet-cell-flow) {
    width: 100%;
  }
}
</style>

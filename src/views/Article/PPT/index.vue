<script lang="ts" setup>
import Container from '../Components/Container.vue'

const route = useRoute()
const infoStore = useInfoStore()
const modelValue = ref('')
const pptIframe = ref(null)
const isPreview = ref(false)
const isLoading = ref(false)
const isPublish = ref(false)
const iframeSrc = ref('http://192.168.94.221:8081') // 8081：幻灯片

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      if (route.path.includes('/ppt')) {
        getArticle(route.query.aid)
      }
      route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
    })
  },
  {
    immediate: true
  }
)

const toPublish = (val) => {
  if (val === 'ppt') {
    pptIframe.value && pptIframe.value.contentWindow.postMessage({ type: 'savePPTData' }, '*')
  }
}

const getArticle = async (aid) => {
  isLoading.value = true
  useArticle().getArticleDetail(aid, (res: any) => {
    isLoading.value = false
    isPublish.value = false
    setTimeout(() => {
      sendMessageToIframe(res.body)
    }, 0)
  })
}

const sendMessageToIframe = (data) => {
  if (pptIframe.value) {
    pptIframe.value.onload = () => {
      pptIframe.value.contentWindow.postMessage({ type: 'getPPTData', data, isPreview: isPreview.value }, '*')
    }
  }
}

const messageHandler = (event) => {
  const receivedData = event.data
  if (receivedData.type === 'savePPT') {
    modelValue.value = JSON.stringify(receivedData.data)
    isPublish.value = true
  }
}

onMounted(() => {
  window.addEventListener('message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<template>
  <div class="PPT_wrap">
    <Container :content="modelValue" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'" :isPublish="isPublish" @toPublish="toPublish">
      <iframe v-if="!isLoading" class="iframe" ref="pptIframe" :src="iframeSrc" frameborder="0" width="100%" height="100%" allowfullscreen="true"></iframe>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.PPT_wrap {
  height: 100vh;
  .Container_wrap {
    height: 100%;
  }
  .iframe {
    height: calc(100vh - 52px);
  }
}
</style>

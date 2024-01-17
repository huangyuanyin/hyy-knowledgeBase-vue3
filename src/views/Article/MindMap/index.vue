<script lang="ts" setup>
import Container from '../Components/Container.vue'

const route = useRoute()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const myIframe = ref(null)
const isLoading = ref(false)
const modelValue = ref('')
const isPublish = ref(false)
const isPreview = ref(false)
const iframeSrc = ref(`${import.meta.env.VITE_BASE_MINDMAP_URL}?time' + Date.now()`) // 8080：思维导图

watch(
  () => infoStore.currentQuery?.aid,
  () => {
    sessionStorage.removeItem('recoverVersion')
    if (infoStore.currentQuery?.aid && route.path.includes('mind') && !sessionStorage.getItem('recoverVersion')) {
      nextTick(() => {
        getArticle(infoStore.currentQuery?.aid)
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  () => route.path.split('/').slice(-1)[0],
  () => {
    sessionStorage.removeItem('recoverVersion')
    isPublish.value = false
    if (route.path.split('/').slice(-1)[0] === 'edit' && !refreshStore.isRefreshMind && route.path.includes('mind') && !sessionStorage.getItem('recoverVersion')) {
      nextTick(() => {
        getArticle(infoStore.currentQuery?.aid)
      })
      refreshStore.setRefreshMind(false)
    }
  }
)

watchEffect(() => {
  route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
  if (sessionStorage.getItem('recoverVersion')) {
    isLoading.value = true
    modelValue.value = sessionStorage.getItem('recoverVersion')
    isLoading.value = false
    iframeSrc.value = null
    iframeSrc.value = `${import.meta.env.VITE_BASE_MINDMAP_URL}?time' + Date.now()`
    myIframe.value.contentWindow.postMessage({ type: 'getOldData', data: modelValue.value, isPreview: false }, '*')
    sessionStorage.removeItem('recoverVersion')
  }
})

const toPublish = (val) => {
  if (val === 'mind') {
    isPublish.value = true
    myIframe.value && myIframe.value.contentWindow.postMessage({ type: 'saveData' }, '*')
  }
}

const getArticle = async (aid) => {
  isLoading.value = true
  useArticle().getArticleDetail(aid, (res: any) => {
    isLoading.value = false
    isPublish.value = false
    modelValue.value = res.body
    setTimeout(() => {
      sendMessageToIframe()
    }, 0)
  })
}

const sendMessageToIframe = () => {
  if (myIframe.value) {
    myIframe.value.onload = () => {
      myIframe.value.contentWindow.postMessage({ type: 'getData', data: modelValue.value, isPreview: isPreview.value }, '*')
    }
  }
}

const messageHandler = (event) => {
  const receivedData = event.data
  if (receivedData.type === 'saveMind') {
    modelValue.value = JSON.stringify(receivedData.data)
    // isPublish.value = true
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
  <div class="MindMap_wrap">
    <Container :content="modelValue" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'" :isPublish="isPublish" @toPublish="toPublish">
      <iframe v-if="!isLoading && iframeSrc" class="iframe" ref="myIframe" name="myIframe" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.MindMap_wrap {
  height: 100vh;
  .Container_wrap {
    height: 100%;
    overflow-y: hidden;
  }
  .iframe {
    height: calc(100vh - 52px);
  }
}
</style>

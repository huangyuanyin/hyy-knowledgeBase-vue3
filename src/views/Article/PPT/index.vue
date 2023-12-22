<script lang="ts" setup>
import { getArticleApi } from '@/api/article'
import Container from '../Components/Container.vue'

const route = useRoute()
const modelValue = ref('')
const pptIframe = ref(null)
const isHasPermissionCode = ref(true)
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
  const res = await getArticleApi(aid)
  isHasPermissionCode.value = res.code === 1003 ? false : true
  isLoading.value = false
  if (res.code === 1000) {
    isPublish.value = false
    setTimeout(() => {
      sendMessageToIframe(res.data.body)
    }, 0)
  } else {
    ElMessage.error(res.msg)
  }
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
    <Container :content="modelValue" :isHasPermission="isHasPermissionCode" :isPublish="isPublish" @toPublish="toPublish">
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

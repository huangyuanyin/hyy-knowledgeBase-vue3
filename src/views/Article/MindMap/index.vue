<script lang="ts" setup>
import { getArticleApi } from '@/api/article'
import Container from '../Components/Container.vue'

const route = useRoute()
const myIframe = ref(null)
const isHasPermissionCode = ref(true)
const isLoading = ref(false)
const modelValue = ref('')
const isPublish = ref(false)
const isPreview = ref(false)
const iframeSrc = ref('http://192.168.94.221:8080') // 8080：思维导图

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      getArticle(route.query.aid)
      route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
    })
  },
  {
    immediate: true
  }
)

const toPublish = (val) => {
  if (val === 'mind') {
    myIframe.value && myIframe.value.contentWindow.postMessage({ type: 'saveData' }, '*')
  }
}

const getArticle = async (aid) => {
  isLoading.value = true
  const res = await getArticleApi(aid)
  isLoading.value = false
  isHasPermissionCode.value = res.code === 1003 ? false : true
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
  if (myIframe.value) {
    myIframe.value.onload = () => {
      myIframe.value.contentWindow.postMessage({ type: 'getData', data, isPreview: isPreview.value }, '*')
    }
  }
}

const messageHandler = (event) => {
  const receivedData = event.data
  if (receivedData.type === 'saveMind') {
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
  <div class="MindMap_wrap">
    <Container :content="modelValue" :isHasPermission="isHasPermissionCode" :isPublish="isPublish" @toPublish="toPublish">
      <iframe v-if="!isLoading" class="iframe" ref="myIframe" name="myIframe" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
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

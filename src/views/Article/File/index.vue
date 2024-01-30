<script lang="ts" setup>
import { Base64 } from 'js-base64'
import Container from '../Components/Container.vue'

const route = useRoute()
const infoStore = useInfoStore()
const iframeSrc = ref('')

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      if (infoStore.currentMenu === 'file') {
        getArticle(infoStore.currentQuery?.aid)
      }
    })
  },
  {
    immediate: true
  }
)

const getArticle = async (aid) => {
  useArticle().getArticleDetail(aid, (res: any) => {
    let url = 'http://10.4.150.56:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(res.body))
    iframeSrc.value = url
  })
}
</script>

<template>
  <div class="File_wrap" h-full>
    <Container :content="''" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'">
      <iframe class="iframe" :src="iframeSrc" frameborder="0" width="100%" height="100%" v-if="typeof infoStore.currentArticleInfo === 'object'"></iframe>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.File_wrap {
  :deep(.Container_wrap) {
    height: 100vh !important;
  }
}
</style>

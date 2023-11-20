<template>
  <iframe class="iframe" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
</template>

<script lang="ts" setup>
import { Base64 } from 'js-base64'
import { getArticleApi } from '@/api/article'

const route = useRoute()
const aid = ref(route.query.aid)
const iframeSrc = ref('')

watch(
  () => route.query.aid,
  (newVal) => {
    aid.value = newVal
    getArticle(aid.value)
  }
)

const getArticle = async (aid) => {
  const res = await getArticleApi(aid)
  if (res.code === 1000) {
    let url = 'http://10.4.150.56:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(res.data.body))
    iframeSrc.value = url
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getArticle(aid.value)
})
</script>

<style lang="scss" scoped></style>

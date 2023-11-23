<script lang="ts" setup>
import { Base64 } from 'js-base64'
import { getArticleApi } from '@/api/article'
import NoPermission from '@/views/NoPermission/index.vue'

const route = useRoute()
const aid = ref(route.query.aid)
const iframeSrc = ref('')
const isHasPermissionCode = ref(true)

watch(
  () => route.query.aid,
  (newVal) => {
    if (route.query.aid && route.path.includes('file')) {
      aid.value = newVal as string
      getArticle(aid.value)
    }
  }
)

const getArticle = async (aid) => {
  const res = await getArticleApi(aid)
  isHasPermissionCode.value = res.code === 1003 ? false : true
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

<template>
  <iframe class="iframe" :src="iframeSrc" frameborder="0" width="100%" height="100%" v-if="isHasPermissionCode"></iframe>
  <NoPermission v-else type="article" />
</template>

<style lang="scss" scoped></style>

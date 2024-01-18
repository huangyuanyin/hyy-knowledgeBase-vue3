<script lang="ts" setup>
import { watchEffect } from 'vue'
import Container from '../Components/Container.vue'

const emit = defineEmits(['toPublish'])

const route = useRoute()
const infoStore = useInfoStore()
const isPreview = ref(true) // 默认预览模式
const body = ref() // 文章内容

watchEffect(() => {
  route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
})

watch(
  () => infoStore.currentQuery.aid,
  async () => {
    if (infoStore.currentQuery.aid && route.path.includes('sheet')) {
      await getArticleTree()
    }
  }
)

onMounted(async () => {
  await getArticleTree()
})

const getArticleTree = async () => {
  body.value = ''
  await useArticle().getArticleDetail(Number(infoStore.currentQuery.aid), (res: any) => {
    if (typeof res === 'string') return
    if (Reflect.ownKeys(res).length) {
      body.value = JSON.parse(res.body)
    }
  })
}
</script>

<template>
  <div class="Sheet_wrap">
    <Container :content="JSON.stringify(body)" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'">
      <Excel :body="body" :isPreview="isPreview" />
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.Sheet_wrap {
  height: 100vh;
}
</style>

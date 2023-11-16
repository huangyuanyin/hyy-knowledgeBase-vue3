<script lang="ts" setup>
import { getArticleApi } from '@/api/article'
import Container from '../Components/Container.vue'

const route = useRoute()
const isUpdate = ref(false)
const aid = ref(route.query.aid as string)
const modelValue = ref('')
const isPreview = ref(true)

watch(
  () => route.query.aid,
  (newVal) => {
    isUpdate.value = false
    aid.value = newVal as string
    getArticle()
  }
)

watchEffect(() => {
  route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
  isUpdate.value = false
  setTimeout(() => {
    isUpdate.value = true
  }, 200)
})

const getArticle = async () => {
  const res = await getArticleApi(aid.value)
  if (res.code === 1000) {
    modelValue.value = res.data.body
    isUpdate.value = true
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getArticle()
})

onBeforeMount(() => {
  isUpdate.value = false
})
</script>

<template>
  <div class="Doc_wrap">
    <Container :content="modelValue">
      <TinyMCE v-if="isUpdate" v-model="modelValue" :readonly="isPreview" />
    </Container>
  </div>
</template>

<style lang="scss" scoped></style>

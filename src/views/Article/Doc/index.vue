<script lang="ts" setup>
import { getArticleApi } from '@/api/article'
import Container from '../Components/Container.vue'

const route = useRoute()
const isUpdate = ref(false)
const aid = ref(route.query.aid as string)
const modelValue = ref('')
const isPreview = ref(true)
const isHasPermissionCode = ref(true)

watch(
  () => route.query.aid,
  (newVal) => {
    isUpdate.value = false
    if (route.query.aid && route.path.includes('doc')) {
      aid.value = newVal as string
      getArticle()
    }
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
  isHasPermissionCode.value = res.code === 1003 ? false : true
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
    <Container :content="modelValue" :isHasPermission="isHasPermissionCode">
      <TinyMCE v-if="isUpdate" v-model="modelValue" :readonly="isPreview" />
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.Doc_wrap {
  height: 100vh;
}
</style>

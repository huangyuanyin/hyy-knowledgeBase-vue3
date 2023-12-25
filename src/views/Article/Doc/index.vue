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
  if (sessionStorage.getItem('recoverVersion')) {
    modelValue.value = sessionStorage.getItem('recoverVersion')
  }
  setTimeout(() => {
    isUpdate.value = true
    sessionStorage.removeItem('recoverVersion')
  }, 200)
})

const getArticle = async () => {
  const res = await getArticleApi(Number(aid.value))
  isHasPermissionCode.value = res.code === 1003 ? false : true
  if (res.code === 1000) {
    isUpdate.value = false
    modelValue.value = res.data.body
    setTimeout(() => {
      isUpdate.value = true
    }, 200)
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
      <TinyMCE v-if="isUpdate && !isPreview" v-model="modelValue" :readonly="isPreview" />
      <MavonEditor v-if="isPreview" :html="modelValue" />
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.Doc_wrap {
  width: -webkit-fill-available;
  box-sizing: border-box;
  :deep(.MavonEditor_wrap) {
    width: -webkit-fill-available;
    height: calc(100vh - 52px);
    box-sizing: border-box;
    .v-note-wrapper {
      border: none;
      height: 100%;
    }
    .v-note-show {
      padding: 0 250px 0 150px;
    }
  }
}
</style>

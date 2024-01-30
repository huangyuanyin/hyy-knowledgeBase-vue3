<script lang="ts" setup>
import Container from '../Components/Container.vue'

const route = useRoute()
const infoStore = useInfoStore()
const isUpdate = ref(false)
const modelValue = ref('')
const isPreview = ref(true)
const isShowScroll = ref(false)

watch(
  () => route.fullPath,
  () => {
    isUpdate.value = false
    nextTick(() => {
      if (infoStore.currentMenu === 'doc') {
        getArticle()
      }
    })
  },
  {
    immediate: true
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
  useArticle().getArticleDetail(Number(infoStore.currentQuery.aid), (res: any) => {
    isUpdate.value = false
    if (typeof res === 'string') return
    if (Reflect.ownKeys(res).length) {
      modelValue.value = res.body
      setTimeout(() => {
        isUpdate.value = true
      }, 200)
    }
  })
}

const scroll = (isScroll: boolean) => {
  isShowScroll.value = isScroll
}

onBeforeMount(() => {
  isUpdate.value = false
})
</script>

<template>
  <div class="Doc_wrap">
    <Container :content="modelValue" :isHasPermission="typeof infoStore.currentArticleInfo === 'object'" :isShowScroll="isShowScroll" @scrollTo="isShowScroll = false">
      <TinyMCE v-if="isUpdate && !isPreview" v-model="modelValue" :readonly="isPreview" />
      <MavonEditor v-if="isPreview" :html="modelValue" @scroll="scroll" :scrollTop="isShowScroll ? null : 0" />
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

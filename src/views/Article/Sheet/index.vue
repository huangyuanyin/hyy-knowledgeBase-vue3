<script lang="ts" setup>
import { watchEffect } from 'vue'
import Container from '../Components/Container.vue'

const emit = defineEmits(['toPublish'])

const route = useRoute()
const isPreview = ref(true) // 默认预览模式
const body = ref() // 文章内容

watchEffect(() => {
  route.path.split('/').slice(-1)[0] === 'edit' ? (isPreview.value = false) : (isPreview.value = true)
})
</script>

<template>
  <div class="Sheet_wrap">
    <Container :content="body">
      <Excel v-model="body" :isPreview="isPreview" />
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.Sheet_wrap {
  height: 100vh;
}
</style>

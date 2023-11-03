<script lang="ts" setup>
import { watchEffect } from 'vue'
import Container from '../Components/Container.vue'

const emit = defineEmits(['toPublish'])

const route = useRoute()
const isPreview = ref(true) // 默认预览模式
const isPublish = ref(false) // 是否发布
const baseData = ref({}) // 基础数据

watchEffect(() => {
  if (route.path.split('/').slice(-1)[0] === 'edit') {
    isPreview.value = false
    console.log(`output->isPreview`, isPreview.value)
  }
})

const toPublish = (params) => {
  isPublish.value = true
  baseData.value = params
}
</script>

<template>
  <div class="Sheet_wrap">
    <Container @toPublish="toPublish">
      <slot> <Excel :isPreview="isPreview" :isPublish="isPublish" :baseData="baseData" /> </slot>
    </Container>
  </div>
</template>

<style lang="scss" scoped></style>

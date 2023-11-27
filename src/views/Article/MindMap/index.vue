<script lang="ts" setup>
import Container from '../Components/Container.vue'

const modelValue = ref('')
const iframeSrc = ref('http://192.168.94.221:8080')
</script>

<template>
  <div class="MindMap_wrap">
    <Container :content="modelValue" :isHasPermission="true">
      <iframe class="iframe" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.MindMap_wrap {
  height: 100vh;
  .Container_wrap {
    height: 100%;
  }
  .iframe {
    height: calc(100vh - 52px);
  }
}
</style>

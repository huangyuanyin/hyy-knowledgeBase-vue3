<template>
  <div class="PPT_wrap">
    <Container :content="modelValue">
      <iframe class="iframe" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
    </Container>
  </div>
</template>

<script lang="ts" setup>
const modelValue = ref('')
const iframeSrc = ref('http://192.168.94.221:8081')
</script>

<style lang="scss" scoped>
.PPT_wrap {
  height: 100vh;
}
</style>

<script lang="ts" setup>
import Container from '../Components/Container.vue'

const route = useRoute()

watchEffect(() => {
  console.log(`output->route.meta`, route.meta)
})
</script>

<template>
  <div class="Doc_wrap">
    <Container>
      <slot> 这是富文本 </slot>
    </Container>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
const props = defineProps({
  html: String
})

onMounted(() => {})
</script>

<template>
  <div class="MavonEditor_wrap">
    <mavon-editor v-model="props.html" defaultOpen="preview" :subfield="false" :toolbarsFlag="false" :boxShadow="false" scrollStyle navigation previewBackground="#fff" />
  </div>
</template>

<style lang="scss" scoped></style>

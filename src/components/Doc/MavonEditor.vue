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

<style lang="scss" scoped>
:deep(.v-note-navigation-title) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.v-show-content) {
  padding-top: 34px !important;
}
</style>

<script lang="ts" setup>
const props = defineProps({
  html: String,
  navigation: {
    type: Boolean,
    default: true
  },
  scrollTop: Number
})
const emit = defineEmits(['scroll'])

const editor = ref<any>(null)

watch(
  () => props.scrollTop,
  (val) => {
    if (val === 0) {
      editor.value.$refs.vShowContent.scrollTop = 0
    }
  }
)

onMounted(() => {
  if (editor.value) {
    const el = editor.value.$refs.vShowContent
    el.addEventListener('scroll', handleScroll)
  }
})

const handleScroll = () => {
  // 获取editor.value.$refs.vShowContent下的第一个div
  const el = editor.value.$refs.vShowContent
  emit('scroll', el.scrollTop > 1500 ? true : false)
}
</script>

<template>
  <div class="MavonEditor_wrap">
    <mavon-editor
      ref="editor"
      v-model="props.html"
      defaultOpen="preview"
      :subfield="false"
      :toolbarsFlag="false"
      :boxShadow="false"
      scrollStyle
      :navigation="props.navigation"
      previewBackground="#fff"
      @scroll="handleScroll"
    />
  </div>
</template>

<style lang="scss" scoped>
.MavonEditor_wrap {
  width: 100%;
}
:deep(.v-note-navigation-title) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.v-show-content) {
  padding-top: 34px !important;
  table {
    border: none;
    colgroup {
      width: 300px;
      min-width: 300px;
    }
  }
}
</style>

<script lang="ts" setup>
const props = defineProps({
  html: String,
  navigation: {
    type: Boolean,
    default: true
  },
  scrollTop: Number,
  readonly: Boolean
})
const emit = defineEmits(['scroll', 'updateValue'])

const { html } = toRefs(props)
const editor = ref<any>(null)
const editorValue = ref('')

watchEffect(() => {
  editorValue.value = html.value
})

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

watch(
  () => editorValue.value,
  (newVal) => {
    emit('updateValue', newVal)
  }
)
</script>

<template>
  <div class="MavonEditor_wrap">
    <mavon-editor
      ref="editor"
      v-model="editorValue"
      defaultOpen="preview"
      :subfield="!props.readonly"
      :toolbarsFlag="!props.readonly"
      :boxShadow="!props.readonly"
      scrollStyle
      :navigation="props.readonly"
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

<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import boldIcon from '@/assets/icons/tiptap/bold.svg'
import orderIcon from '@/assets/icons/tiptap/order.svg'
import unorderIcon from '@/assets/icons/tiptap/unorder.svg'
import imageIcon from '@/assets/icons/tiptap/image.svg'
import linkIcon from '@/assets/icons/tiptap/link.svg'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const limit = ref<number>(100)

let editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit, // 基础扩展
    Document, // 文档
    Paragraph, // 段落
    Text, // 文本
    Bold, // 粗体
    // 有序列表
    OrderedList.configure({
      HTMLAttributes: {
        class: 'hyy-order-list'
      },
      itemTypeName: 'listItem'
      // keepMarks: true,
      // keepAttributes: true
    }),
    // 无序列表
    BulletList.configure({
      HTMLAttributes: {
        class: 'hyy-unorder-list'
      },
      itemTypeName: 'listItem'
      // keepMarks: true,
      // keepAttributes: true
    }),
    ListItem, // 列表项
    Image.configure({
      HTMLAttributes: {
        class: 'hyy-image'
      },
      inline: true,
      allowBase64: true
    }),
    Link.configure({
      HTMLAttributes: {
        class: 'hyy-link'
      },
      validate: (href) => /^https?:\/\//.test(href),
      openOnClick: true,
      linkOnPaste: true
    }),
    // 字数
    CharacterCount.configure({
      limit: limit.value
    }),
    // 换行
    HardBreak.configure({
      keepMarks: true
    }),
    Placeholder.configure({
      placeholder: props.placeholder
    })
  ],
  autofocus: 'end',
  editable: props.disabled
})

watchEffect(() => {
  if (props.disabled) {
    editor.value && editor.value.setEditable(false)
  } else {
    editor.value && editor.value.setEditable(true)
  }
})

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value.getHTML() === value
    if (isSame) {
      return
    }
    editor.value.commands.setContent(value, false)
  }
)

watch(
  () => editor.value && editor.value.getHTML(),
  (value) => {
    const isSame = props.modelValue === value
    if (isSame) {
      return
    }
    emit('update:modelValue', value)
  }
)

const setImage = async (uploadFile) => {
  if (uploadFile) {
    getBase64Image(uploadFile.raw).then((res) => {
      editor.value.chain().focus().setImage({ src: res, alt: 'tips' }).run()
    })
  }
}

const setBold = () => {
  editor.value.isActive('bold') ? editor.value.chain().focus().unsetBold().run() : editor.value.chain().focus().setBold().run()
}

const setOrderList = () => {
  editor.value.chain().focus().toggleOrderedList().run()
}

const setBulletList = () => {
  editor.value.chain().focus().toggleBulletList().run()
}

const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  // cancelled
  if (url === null) {
    return
  }
  // empty
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  // update link
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div class="Tiptap_wrap" :class="[props.disabled ? 'is-disbaled' : '']">
    <div :class="['tab']" flex v-if="editor && !props.disabled">
      <div class="button" flex cursor-pointer>
        <!--图片-->
        <el-tooltip effect="dark" content="图片" placement="bottom" :show-arrow="false">
          <el-upload ref="uploadRef" accept=".png,.jpg,.svg" :show-file-list="false" :auto-upload="false" @change="setImage">
            <button ml-4px>
              <span w-24px h-24px flex items-center justify-center class="hover:bg-#e7e9e8" rounded-6px>
                <img h-16px w-16px :src="imageIcon" alt="" />
              </span>
            </button>
          </el-upload>
        </el-tooltip>
        <!--加粗-->
        <el-tooltip effect="dark" content="粗体" placement="bottom" :show-arrow="false">
          <button ml-4px @click.stop="setBold">
            <span w-24px h-24px flex items-center justify-center class="hover:bg-#e7e9e8" :class="['hyy-bold', editor.isActive('bold') ? 'hyy-bold-active' : '']" rounded-6px>
              <img h-16px w-16px :src="boldIcon" alt="" />
            </span>
          </button>
        </el-tooltip>
        <!--有序列表-->
        <el-tooltip effect="dark" content="有序列表" placement="bottom" :show-arrow="false">
          <button ml-4px @click.stop="setOrderList">
            <span w-24px h-24px flex items-center justify-center class="hover:bg-#e7e9e8" :class="[editor.isActive('orderedList') ? 'hyy-order-list-active' : '']" rounded-6px>
              <img h-16px w-16px :src="unorderIcon" alt="" />
            </span>
          </button>
        </el-tooltip>
        <!--无序列表-->
        <el-tooltip effect="dark" content="无序列表" placement="bottom" :show-arrow="false">
          <button ml-4px @click.stop="setBulletList">
            <span w-24px h-24px flex items-center justify-center rounded-6px class="hover:bg-#e7e9e8" :class="[editor.isActive('bulletList') ? 'hyy-unorder-list-active' : '']">
              <img h-16px w-16px :src="orderIcon" alt="" />
            </span>
          </button>
        </el-tooltip>
        <!--链接-->
        <el-tooltip effect="dark" content="插入链接" placement="bottom" :show-arrow="false">
          <button ml-4px @click.stop="setLink">
            <span w-24px h-24px flex items-center justify-center class="hover:bg-#e7e9e8" rounded-6px>
              <img h-16px w-16px :src="linkIcon" alt="" />
            </span>
          </button>
        </el-tooltip>
      </div>
      <div color="#d8dad9" text-10px flex items-center>{{ editor.storage.characterCount.characters() }} / {{ limit }}字</div>
    </div>
    <editor-content w-full flex :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.Tiptap_wrap {
  width: 100%;
  min-height: 120px;
  height: auto;
  position: relative;
  .tab {
    position: absolute;
    bottom: 4px;
    left: 4px;
    z-index: 9;
    justify-content: space-between !important;
    width: 100%;
    padding-right: 12px !important;
  }
  .hyy-bold-active,
  .hyy-order-list-active,
  .hyy-unorder-list-active {
    background-color: #e7e9e8 !important;
  }
  :deep(.tiptap) {
    display: inline !important;
    width: 100%;
    min-height: 120px;
    height: auto;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 12px 12px 44px 12px;
    p {
      color: #262626;
      font-size: 14px;
    }
    &:focus-visible {
      outline: none;
    }
    .hyy-unorder-list,
    .hyy-order-list {
      list-style: revert;
    }
    .hyy-bold {
      &:hover {
        background-color: #e7e9e8;
      }
    }
    .hyy-link {
      color: #117cee;
      text-decoration: underline;
    }
    > * + * {
      margin-top: 0.55em;
    }
    ul,
    ol {
      padding: 0 1rem;
    }
  }
}
.is-disbaled {
  min-height: auto !important;
  :deep(.tiptap) {
    height: min-content;
    min-height: 20px !important;
    border: none !important;
    padding: 12px 12px 12px 12px !important;
  }
}
</style>

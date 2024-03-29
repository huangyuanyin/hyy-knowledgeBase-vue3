<template>
  <div style="position: relative; width: 100%">
    <div id="sample" class="TinyMCE_wrap">
      <Editor :disabled="props.readonly" v-model="editorValue" :api-key="key" :init="initOptions"></Editor>
      <div v-if="!['team', 'directory'].includes(infoStore.currentMenu)" id="outside-toc" class="outside-toc"></div>
      <div id="show" class="outside-btn"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import { environmentPrefix } from '@/data/data'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'calc(100vh - 52px)'
  },
  bodyStyle: {
    type: String,
    default: `
         body { margin: 4rem; }
        .mce-toc { border:0px ;right: 8%;min-width: 250px;top:20px }
        .mce-content-body [contentEditable=false][data-mce-selected] { outline:0px }
        .mce-content-body {width:60%}
        `
  },
  resize: {
    type: Boolean,
    default: false
  },
  plugins: {
    type: [String, Array],
    default:
      'customHyy quickbars  pasteuploadimage attachment upfile paste pastetext formatpainter help autosave editimage lists advlist code charmap link fullscreen emoticons wordcount image codesample codeformat  directionality autosave  visualblocks autolink inserthr anchor  tableofcontents  importcss insertdatetime media pagebreak  preview searchreplace table toc'
  },
  toolbar: {
    type: [String, Array],
    default: [
      'table pastetext undo redo removeformat formatpainter blocks fontsize bold italic strikethrough underline superscript subscript codeformat forecolor backcolor align bullist numlist  lineheight  link blockquote hr searchreplace anchor help tableofcontents tableofcontentsupdate  charmap emoticons wordcount  code  codesample toc image fullscreen   preview autolink  autosave'
    ]
  }
})

const infoStore = useInfoStore()
const { modelValue } = toRefs(props)
const key = '3wvx4jkjmreyeiqypzs5hnwrkncklep4xi69inkwgfoipxj7'
const isDev = import.meta.env.VITE_BASE_SETTING === 'dev'
const editorValue = ref(modelValue.value)
const initOptions = ref({
  skin_url: isDev ? '/tinymce/skins/ui/oxide' : `${environmentPrefix[import.meta.env.MODE]}tinymce/skins/ui/oxide`,
  content_style: props.bodyStyle, // 设置内容样式
  with: '100px',
  height: props.height,
  min_height: 100,
  placeholder: '直接输入正文...', // 设置占位符
  language_url: isDev ? '/tinymce/langs/zh-Hans.js' : `${environmentPrefix[import.meta.env.MODE]}tinymce/langs/zh-Hans.js`, // 设置本地语言，在本地的路径
  language: 'zh-Hans', // 设置本地语言
  plugins: props.plugins, // 插件
  toolbar: props.readonly ? false : props.toolbar, // 工具栏
  toolbar_mode: 'sliding', // 工具栏模式
  autosave_ask_before_unload: false, // 编辑器是否应提示用户在尝试关闭当前窗口时告知他们有未保存的更改
  autosave_interval: '2s', // 编辑器在拍摄当前内容的快照和将其保存到本地存储之间应等待的时间。默认为“ 30s”
  autosave_prefix: 'tinymce-autosave', // 用于保存的键的前缀
  block_formats: '正文=p; 标题1=h1; 标题2=h2; 标题3=h3; 标题4=h4; 标题5=h5; 标题6=h6', // 设置块格式
  line_height_formats: '1 1.2 1.4 1.6 2 2.5 3', // 设置行高格式
  readonly: props.readonly, // 设置只读
  statusbar: props.readonly ? false : true, // 是否隐藏状态栏
  menubar: false, // 是否隐藏菜单栏
  branding: false, // 是否隐藏品牌
  resize: props.resize, // 是否允许调整大小
  help_accessibility: true, // 是否在 TinyMCE 状态栏中显示用于访问“帮助”对话框的键盘快捷键。
  a11y_advanced_options: true, // 是否在“插入链接”对话框中显示高级选项
  file_picker_callback: (cb) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.addEventListener('change', (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader() as any
      reader.addEventListener('load', () => {
        const id = 'blobid' + new Date().getTime()
        const blobCache = tinymce.activeEditor.editorUpload.blobCache
        const base64 = reader.result.split(',')[1]
        const blobInfo = blobCache.create(id, file, base64)
        blobCache.add(blobInfo)
        cb(blobInfo.blobUri(), { title: file.name })
      })
      reader.readAsDataURL(file)
    })
    input.click()
  },
  help_tabs: [
    'shortcuts',
    'keyboardnav'
    //  'plugins', 'versions'
  ], // 设置帮助选项卡
  image_advtab: true, // 是否显示高级选项卡
  image_dimensions: true, // 是否显示图像尺寸
  image_description: true, // 是否显示图像描述
  image_caption: true, // 是否显示图像标题
  image_title: true, // 是否显示图像标题
  image_class_list: [
    { title: '无', value: '' },
    { title: '居中', value: 'img-center' },
    { title: '左浮动', value: 'img-left' },
    { title: '右浮动', value: 'img-right' }
  ], // 设置图像类列表
  file_picker_types: 'image', // 设置文件选择器类型
  automatic_uploads: true, // 是否自动上传
  paste_convert_word_fake_lists: true, // 插入word文档需要该属性
  paste_webkit_styles: 'all', // 粘贴时的样式
  paste_merge_formats: true, // 合并格式
  nonbreaking_force_tab: false, // 禁用非打断空格
  paste_auto_cleanup_on_paste: false, // 禁用粘贴时的自动清理
  paste_remove_styles_if_webkit: false, // 禁用webkit粘贴时的样式
  paste_strip_class_attributes: false, // 禁用粘贴时的类属性
  paste_retain_style_properties: 'all', // 粘贴时的样式
  paste_data_images: true, // 粘贴时的图片
  paste_enable_default_filters: true, // 粘贴时的过滤器
  paste_word_valid_elements: '*[*]', // 粘贴时的元素
  paste_word_remove_styles: false, // 粘贴时的样式
  paste_word_remove_font_styles: false, // 粘贴时的字体样式
  paste_word_cleanup_on_paste: false, // 粘贴时的清理
  paste_word_inline_styles: false, // 粘贴时的内联样式
  paste_word_tab_interval: 0, // 粘贴时的间隔
  skeletonScreen: true,
  quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
  quickbars_selection_toolbar: 'bold italic underline quicklink h2 h3 blockquote quickimage quicktable tablemergecells',
  quickbars_insert_toolbar: 'p h2 h3 bullist numlist quickimage quicktable hr',
  formats: {
    formatpainter_checklist: { selector: 'ul', classes: 'tox-checklist' },
    formatpainter_liststyletype: { selector: 'ul,ol', styles: { listStyleType: '%value' } },
    formatpainter_borderstyle: {
      selector: 'td,th',
      styles: { borderTopStyle: '%valueTop', borderRightStyle: '%valueRight', borderBottomStyle: '%valueBottom', borderLeftStyle: '%valueLeft' },
      remove_similar: true
    },
    formatpainter_bordercolor: {
      selector: 'td,th',
      styles: { borderTopColor: '%valueTop', borderRightColor: '%valueRight', borderBottomColor: '%valueBottom', borderLeftColor: '%valueLeft' },
      remove_similar: true
    },
    formatpainter_backgroundcolor: { selector: 'td,th', styles: { backgroundColor: '%value' }, remove_similar: true },
    formatpainter_removeformat: [
      {
        selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
        remove: 'all',
        split: true,
        expand: false,
        block_expand: true,
        deep: true
      },
      { selector: 'span', attributes: ['style', 'class'], remove: 'empty', split: true, expand: false, deep: true },
      { selector: '*:not(tr,td,th,table)', attributes: ['style', 'class'], split: false, expand: false, deep: true }
    ]
  },
  toc_header: 'div', // 设置目录的标题
  toc_depth: 6, // 设置目录的深度
  setup: (editor) => {
    editor.on('keyup', () => {
      editor.execCommand('mceInsertOrUpdateToc')
    })
    editor.on('init', () => {
      editor.execCommand('mceInsertOrUpdateToc')
    })
    // editor.ui.registry.addContextToolbar('paragraphlink', {
    //   predicate: (node) => {
    //     return node.nodeName.toLowerCase() === 'p'
    //   },
    //   items: 'quicklink bold',
    //   position: 'node'
    // })
  }
})

watch(
  () => editorValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

onBeforeMount(() => {
  tinymce.baseURL = isDev ? '/tinymce' : `${environmentPrefix[import.meta.env.MODE]}tinymce`
})
</script>

<style lang="scss" scoped>
.TinyMCE_wrap {
  z-index: 99;
  :deep(.tox-tinymce) {
    border: none;
    border-radius: 0px;
    .tox-editor-header {
      padding: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      box-shadow: none;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .tox-toolbar {
        background-size: 0;
        .tox-toolbar__group {
          position: relative;
          height: 42px;
          &::after {
            content: '';
            position: absolute;
            top: 25%;
            right: 0;
            width: 1px;
            height: 50%;
            background-color: #f4f5f5;
          }
        }
        .tox-tbtn {
          cursor: pointer;
          border-radius: 6px;
          span {
            cursor: pointer;
          }
          &:hover {
            background-color: #f4f5f5;
          }
        }
        .tox-split-button {
          cursor: pointer;
          border-radius: 6px;
          &:hover {
            box-shadow: none;
            background-color: #f4f5f5;
            .tox-tbtn svg {
              fill: #222f3e;
            }
          }
        }
      }
    }
    .tox-sidebar-wrap {
      box-sizing: border-box;
    }
    :deep(.mce-toc) {
      position: absolute !important;
      right: 8%;
      min-width: 250px;
      h2 {
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="scss">
.active {
  font-weight: 600 !important;
}
.outside-btn {
  display: none;
  right: 10px;
  position: absolute;
  top: 50px;
  overflow-y: auto;
  padding: 10px;
}
.outside-toc {
  position: absolute;
  top: 101px;
  right: 15px;
  width: 300px;
  height: 86%;
  overflow-y: auto;
  padding: 10px;
  z-index: 200;
  background: #fff;
}

#outside-toc {
  h2 {
    font-size: 14px;
    margin-bottom: 12px;
    padding-top: 32px;
    padding-left: 28px;
    display: flex;
    align-items: center;
    height: 30px;
    flex-shrink: 0;
    margin-right: 8px;
    color: #262626;
  }
}
#outside-toc {
  ul > div {
    line-height: 25px;
    border-left: 2px solid #eff0f0;
    margin-left: -5px;
    li {
      list-style-type: none; /* 去除默认点 */
      font-size: 14px;
      //color: #585a5a;
      font-weight: 260;
      overflow: hidden;
      width: 80%;
      text-overflow: ellipsis;
      white-space: nowrap;
      a {
        text-decoration: none;
        //color: #585a5a;
        cursor: pointer;
      }
    }
  }
}
.outside-toc {
  ul > li {
    .active {
      color: red;
    }
  }
}
.tox-edit-area__iframe {
  :deep(.mce-content-body) {
    background-color: red !important;
  }
  .mce-toc {
    position: absolute !important;
    right: 8%;
    min-width: 250px;
    h2 {
      font-size: 14px;
    }
  }
}

.mce-content-body {
  background-color: red !important;
}
.level-1 {
  padding-left: 5%;
}
.level-2 {
  padding-left: 10%;
  margin-left: -2px;
}
.level-3 {
  padding-left: 15%;
}
.level-4 {
  padding-left: 20%;
}
.level-5 {
  padding-left: 25%;
}
.level-6 {
  padding-left: 30%;
}
.activeBorderLeft {
  border-left: 3px solid #00b96b !important;
}
.activeBorderBottom {
  border-left: 0px solid #00b96b !important;
  border-bottom: 2px solid #00b96b !important;
}
.my-custom-li-class {
  position: fixed;
  top: 100px;
}
.your-class-name {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  align-items: flex-end; /* 元素居右对齐 */
}
.outside-toc::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}
#show {
  display: none;
  margin-left: 10px;
}
#button {
  margin-left: 10px;
}
.outside-toc {
  scrollbar-width: none;
}
</style>

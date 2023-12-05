<template>
  <div class="TinyMCE_wrap" :style="{ width: props.width }">
    <Editor :disabled="props.readonly" v-model="editorValue" :api-key="key" :init="initOptions"></Editor>
  </div>
</template>

<script lang="ts" setup>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'

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
    default: 'body { margin: 3rem 30% 3rem 15% }'
  },
  resize: {
    type: Boolean,
    default: false
  },
  /**
   * table:表格；code:源代码；preview:预览；fullscreen:全屏；emoticons:表情；wordcount:字数统计； image:图像；codesample:代码示例；
   * searchreplace:查找替换；charmap:特殊字符；link:超链接；advlist:高级列表；anchor:锚点；autolink:自动链接；autosave:自动存稿；hr:分割线；
   * insertdatetime:插入日期时间；lists:列表；media:插入编辑媒体；pagebreak:插入分页符；quickbars:快速工具栏；visualblocks:显示元素范围；
   * nonbreaking:插入不间断空格；template:内容模板；visualchars:显示不可见字符；directionality:文字方向；importcss:引入css；save:保存；
   * fontsize:字体大小；forecolor:字体颜色；backcolor:背景颜色；blockquote:块引用；removeformat:清除格式；undo:撤销；redo:重做；
   * bold:加粗；italic:斜体；underline:下划线；strikethrough:删除线；subscript:下标；superscript:上标；alignleft:左对齐；aligncenter:居中对齐；
   * alignright:右对齐；alignjustify:两端对齐；outdent:减少缩进；indent:增加缩进；visualaid:显示隐藏元素；print:打印；spellchecker:拼写检查；
   * insertfile:插入文件；insertimage:插入图片；insertvideo:插入视频；inserttable:插入表格；toc:插入目录；inserthr:插入水平线；pagebreak:插入分页符；
   * editimage :编辑图片;
   * quickbars:快速工具栏；
   * numlist:有序列表；
   * toc:目录；
   * formatpainter:格式刷；
   * tpImportword:导入word
   * pasteuploadimage,attachment,upfile
   */
  plugins: {
    type: [String, Array],
    default:
      '  customHyy  pasteuploadimage attachment upfile paste pastetext formatpainter help autosave editimage lists advlist code charmap link fullscreen emoticons wordcount image codesample codeformat  directionality autosave  visualblocks autolink inserthr anchor  tableofcontents  importcss insertdatetime media pagebreak  preview searchreplace table'
  },
  toolbar: {
    type: [String, Array],
    default: [
      'custom_button     paste pastetext   undo redo removeformat formatpainter blocks fontsize bold italic strikethrough underline superscript subscript codeformat forecolor backcolor align bullist numlist  lineheight  link blockquote hr searchreplace anchor  charmap help tableofcontents tableofcontentsupdate  insertdatetime  charmap emoticons wordcount  code  codesample visualblocks image fullscreen   preview autolink  autosave'
    ]
  }
})

const { modelValue } = toRefs(props)
const key = '3wvx4jkjmreyeiqypzs5hnwrkncklep4xi69inkwgfoipxj7'
const isDev = import.meta.env.VITE_BASE_SETTING === 'dev'
const editorValue = ref(modelValue.value)
const initOptions = ref({
  // selector: 'textarea',
  // skin: false,
  // menubar: false,
  // content_css: false,
  skin_url: isDev ? '/tinymce/skins/ui/oxide' : '/netKmp/tinymce/skins/ui/oxide',
  // skin: 'jam', //果酱图标
  // icons: 'jam', //果酱图标
  content_style: props.bodyStyle, // 设置内容样式
  with: '100px',
  height: props.height,
  placeholder: '直接输入正文...', // 设置占位符
  language_url: isDev ? '/tinymce/langs/zh-Hans.js' : '/netKmp/tinymce/langs/zh-Hans.js', // 设置本地语言，在本地的路径
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
  statusbar: true, // 是否隐藏状态栏
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
  // quickbars_insert_toolbar: false, // 禁用快速插入上下文工具栏
  // quickbars_selection_toolbar: false, // 禁用快速选择上下文工具栏
  // quickbars_image_toolbar: false, // 禁用快速图像上下文工具栏
  quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions', // 快速图像工具栏
  quickbars_selection_toolbar: 'bold italic underline quicklink h2 h3 blockquote quickimage quicktable', // 快速工具栏
  quickbars_insert_toolbar: 'p h2 h3 bullist numlist quickimage quicktable hr', // 快速插入工具栏
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
  // ...getPasteOption(),
  // ...getImageOption(),
  setup: (editor) => {
    editor.on('init', () => {
      //
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
  tinymce.baseURL = isDev ? '/tinymce' : '/netKmp/tinymce'
})
</script>

<style lang="scss" scoped>
.TinyMCE_wrap {
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
            background-color: #f4f5f5; /* 竖线的颜色 */
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
  }
}
</style>

<!-- // 设置工具栏 toolbar: [ 'bold italic hr | fontsize forecolor backcolor | blocks blockquote removeformat | undo redo ', 'bullist table insertdatetime | link charmap emoticons
wordcount searchreplace code | codesample visualblocks image fullscreen preview' ]
// 设置插件 plugins: 'codesample lists advlist link autolink charmap emoticons fullscreen
preview code searchreplace table visualblocks wordcount insertdatetime image' -->

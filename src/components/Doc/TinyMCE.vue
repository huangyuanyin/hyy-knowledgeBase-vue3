<template>
  <div class="TinyMCE_wrap" :style="{ width: props.width }">
    <Editor v-model="editorValue" :api-key="key" :init="initOptions"></Editor>
  </div>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '34343'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'calc(100vh - 52px)'
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
   * numlist:有序列表；
   */

  plugins: {
    type: [String, Array],
    default:
      'help autosave lists advlist code charmap link fullscreen emoticons wordcount image codesample codeformat  directionality autosave  visualblocks autolink inserthr anchor quickbars tableofcontents advlist importcss insertdatetime lists media pagebreak  preview quickbars searchreplace table'
  },
  toolbar: {
    type: [String, Array],
    default: [
      ' undo redo removeformat | blocks fontsize bold italic strikethrough underline superscript subscript codeformat   | forecolor backcolor |align bullist numlist  lineheight | link blockquote hr searchreplace anchor  charmap help tableofcontents tableofcontentsupdate  insertdatetime |  charmap emoticons wordcount |  code  codesample visualblocks image fullscreen   preview autolink  autosave'
    ]
  }
})

const { modelValue } = toRefs(props)
const key = '3wvx4jkjmreyeiqypzs5hnwrkncklep4xi69inkwgfoipxj7'
const editorValue = ref(modelValue.value)
const initOptions = ref({
  // selector: 'textarea',
  // skin: false,
  // menubar: false,
  // content_css: false,
  skin: 'jam', //果酱图标
  icons: 'jam', //果酱图标
  content_style: 'body { margin: 3rem 30% 3rem 15% }', // 设置内容样式
  with: '100px',
  height: props.height,
  language_url: '/tinymce/langs/zh-Hans.js', // 设置本地语言，在本地的路径
  language: 'zh-Hans', // 设置本地语言
  plugins: props.plugins, // 插件
  toolbar: props.toolbar, // 工具栏
  toolbar_mode: 'sliding',
  autosave_ask_before_unload: false, // 编辑器是否应提示用户在尝试关闭当前窗口时告知他们有未保存的更改
  autosave_interval: '2s', // 编辑器在拍摄当前内容的快照和将其保存到本地存储之间应等待的时间。默认为“ 30s”
  autosave_prefix: 'tinymce-autosave', // 用于保存的键的前缀
  block_formats: '正文=p; 标题1=h1; 标题2=h2; 标题3=h3; 标题4=h4; 标题5=h5; 标题6=h6', // 设置块格式
  line_height_formats: '1 1.2 1.4 1.6 2 2.5 3', // 设置行高格式
  statusbar: true, // 是否隐藏状态栏
  menubar: false // 是否隐藏菜单栏
  // ...getPasteOption(),
  // ...getImageOption()
})
</script>

<style lang="scss" scoped>
.TinyMCE_wrap {
  :deep(.tox-tinymce) {
    border: none;
    border-radius: 0px;
    .tox-editor-header {
      box-shadow: none;
      .tox-toolbar {
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        background-size: 0;
      }
    }
    .tox-sidebar-wrap {
      // padding: 20px 40px 0px 40px;
      box-sizing: border-box;
      .tox-edit-area {
        // margin: 0 auto;
        // // padding-left: 170px;
        // box-sizing: border-box;
      }
      iframe {
        // max-width: 800px;
      }
    }
  }
}
</style>
<!-- 
<script setup>
let init = reactive({
  // 选择器
  selector: 'textarea',
  // 设置本地语言，在本地的路径
  language_url: '/tinymce/langs/zh-Hans.js',
  // 设置本地语言
  language: 'zh-Hans',
  // 设置工具栏
  toolbar: [
    'bold italic hr | fontsize forecolor backcolor | blocks blockquote removeformat | undo redo ',
    'bullist table insertdatetime | link charmap emoticons wordcount searchreplace code | codesample visualblocks image fullscreen preview'
  ],
  // 设置插件
  plugins: 'codesample lists advlist link autolink charmap emoticons fullscreen preview code searchreplace table visualblocks wordcount insertdatetime image'
})
</script> -->
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import './assets/iconfont/iconfont.js'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import XEUtils from 'xe-utils'
import {
  // 全局对象
  VXETable,

  // 表格功能
  // Filter,
  // Edit,
  // Menu,
  // Export,
  // Keyboard,
  // Validator,

  // 可选组件
  Icon,
  Column,
  // Colgroup,
  // Grid,
  // Tooltip,
  // Toolbar,
  // Pager,
  // Form,
  // FormItem,
  // FormGather,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Switch,
  // Input,
  // Select,
  // Optgroup,
  // Option,
  // Textarea,
  // Button,
  // Modal,
  // List,
  // Pulldown,

  // 表格
  Table
} from 'vxe-table'
import zhCN from 'vxe-table/es/locale/lang/zh-CN'
import 'vxe-table/styles/cssvar.scss'
import 'vxe-table/lib/style.css'

import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

function useTable(app) {
  // 表格功能
  // app.use(Filter)
  // .use(Edit)
  // .use(Menu)
  // .use(Export)
  // .use(Keyboard)
  // .use(Validator)

  // 可选组件
  app
    .use(Icon)
    .use(Column)
    // .use(Colgroup)
    // .use(Grid)
    // .use(Tooltip)
    // .use(Toolbar)
    // .use(Pager)
    // .use(Form)
    // .use(FormItem)
    // .use(FormGather)
    // .use(Checkbox)
    // .use(CheckboxGroup)
    // .use(Radio)
    // .use(RadioGroup)
    // .use(RadioButton)
    // .use(Switch)
    // .use(Input)
    // .use(Select)
    // .use(Optgroup)
    // .use(Option)
    // .use(Textarea)
    // .use(Button)
    // .use(Modal)
    // .use(List)
    // .use(Pulldown)

    // 安装表格
    .use(Table)
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router).use(pinia).use(useTable).use(mavonEditor).use(UndrawUi)
app.component('SvgIcon', SvgIcon)
app.mount('#app')

//注册自定义指令 v-resize
app.directive('resize', {
  beforeMount(el, binding) {
    const handleResize = binding.value

    let startX = 0
    let startWidth = 0

    const handleMouseDown = (event) => {
      const parentElement = el.parentNode // 获取父级元素
      startX = event.clientX
      startWidth = parentElement.offsetWidth // 使用父级元素的宽度

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event) => {
      const deltaX = event.clientX - startX
      const newWidth = startWidth + deltaX
      if (newWidth < 270) return
      if (newWidth > 400) return
      el.parentNode.style.width = `${newWidth}px`
      handleResize(newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    el.addEventListener('mousedown', handleMouseDown)
  }
})

import './permission'

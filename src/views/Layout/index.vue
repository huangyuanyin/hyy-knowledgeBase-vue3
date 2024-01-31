<template>
  <el-container w-100vw h-100vh flex class="layout-wrap">
    <el-aside v-if="currentSidebar" :style="{ width: sidebarWidth }" bg="#fafafa" border-box border-r-1 border-solid border-rgba-0-0-0-0-06>
      <component :is="currentSidebar" />
      <div
        class="resize"
        v-if="isShowResize"
        :style="{ left: parseInt(sidebarWidth) - 6 + 'px' }"
        v-resize="handleResize"
        @mouseenter="isShowClose = true"
        @mouseleave=";(visible = false) && (visible2 = false) && (isShowExpand = false) && (isShowClose = false)"
      ></div>
      <el-tooltip effect="dark" content="收起" placement="right" :visible="visible">
        <div
          class="resize-left"
          v-if="isShowClose"
          @mouseenter=";(visible = true) && (isShowClose = true)"
          @mouseleave="hideTooltip"
          :style="{ left: parseInt(sidebarWidth) - 9 + 'px' }"
          @click.stop="toExpandCollapse('close')"
        >
          <span></span>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="展开" placement="right" :visible="visible2">
        <div class="resize-right" @mouseenter="visible2 = true" @mouseleave="visible2 = false" v-if="isShowExpand" @click.stop="toExpandCollapse('expand')">
          <span></span>
        </div>
      </el-tooltip>
    </el-aside>
    <el-main
      flex-1
      :class="[asideComponent === 'DirectorySidebar' ? 'no-padding' : 'use-padding']"
      :style="{ padding: asideComponentWidth[asideComponent].padding, 'overflow-y': isShowPreviewFile ? 'hidden' : 'auto' }"
    >
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
const route = useRoute()
const isShowPreviewFile = ref<boolean>(false)
const currentSidebar = ref<null | any>(null)
const asideComponent = ref<string | null>(route.meta.asideComponent as string | null)
const asideComponentWidth = {
  Sidebar: {
    with: '254px',
    padding: '26px 36px !important'
  },
  SpaceSidebar: {
    with: '254px',
    padding: '26px 36px !important'
  },
  DirectorySidebar: {
    with: '345px',
    padding: ''
  },
  OrganizeSidebar: {
    with: '256px',
    padding: '48px 52px !important'
  },
  TeamSidebar: {
    with: '256px',
    padding: '48px 52px !important'
  },
  BookSidebar: {
    with: '256px',
    padding: '48px 52px !important'
  },
  UserSidebar: {
    with: '256px',
    padding: '48px 52px !important'
  }
}
const sidebarWidth = ref('')
const isShowClose = ref(false)
const isShowExpand = ref(false)
const visible = ref(false)
const visible2 = ref(false)
const isShowResize = ref(true)

watchEffect(() => {
  sidebarWidth.value = asideComponentWidth[asideComponent.value].with
  isShowPreviewFile.value = route.path.split('/').slice(-2)[0] === 'file' || route.path.split('/').slice(-2)[0] === 'ppt'
})

watch(
  () => sidebarWidth.value,
  (val) => {
    val === '0px' ? (isShowExpand.value = true) : (isShowExpand.value = false)
  }
)

const hideTooltip = () => {
  visible.value = false
  visible2.value = false
  isShowClose.value = false
}

const handleResize = (val) => {
  sidebarWidth.value = val + 'px'
  sidebarWidth.value ? (isShowClose.value = true) : (isShowClose.value = false)
}

const toExpandCollapse = (type) => {
  visible.value = false
  visible2.value = false
  isShowClose.value = false
  if (type === 'close') {
    isShowResize.value = false
    sidebarWidth.value = '0px'
  } else {
    isShowResize.value = true
    sidebarWidth.value = asideComponentWidth[asideComponent.value].with
  }
}

const loadSidebar = (asideComponent) => {
  if (asideComponent) {
    currentSidebar.value = defineAsyncComponent(() => import(`../../components/Sidebar/${asideComponent}.vue`))
  } else {
    currentSidebar.value = null
  }
}

onMounted(() => {
  loadSidebar(asideComponent.value)
})

onBeforeRouteUpdate((to, from) => {
  if (to.meta.asideComponent !== from.meta.asideComponent) {
    asideComponent.value = to.meta.asideComponent as string | null
    loadSidebar(asideComponent.value)
  }
})
</script>

<style lang="scss" scoped>
.layout-wrap {
  .no-padding {
    padding: 0 !important;
  }
  .resize {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0px;
    width: 8px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    cursor: ew-resize;
  }
  .resize::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: red;
  }
  .resize::after {
    right: 6px;
    width: 1px;
  }
  &:hover {
    .resize-left {
      display: flex;
    }
  }
}

.resize-left {
  display: none;
  z-index: 2200;
  position: absolute;
  top: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 18px;
  background-color: #e7e9e8;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  opacity: 1;
  will-change: top, opacity;
  transform: translateY(-50%);
  color: #e7e9e8;
  span {
    display: inline-block;
    border-left: 6px solid #262626;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    align-self: center;
    transform: rotate(180deg);
    margin-left: -6px;
    color: #262626;
  }
}

.resize-right {
  z-index: 2200;
  position: absolute;
  left: 0px;
  top: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 18px;
  background-color: #fff;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  opacity: 1;
  will-change: top, opacity;
  transform: translateY(-50%);
  transition: all 0.3s ease 0.5s;
  color: #fff;
  span {
    display: inline-block;
    border-left: 6px solid #262626;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    align-self: center;
    transform: rotate(360deg);
    margin-right: -6px;
    color: #262626;
  }
}

.resize-left,
.resize-right:hover {
  background-color: #e7e9e8;
  color: #e7e9e8;
}
</style>

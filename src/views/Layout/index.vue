<template>
  <el-container class="layout-wrap">
    <el-aside v-if="currentSidebar" class="layout-wrap-left" :style="{ width: asideComponentWidth[asideComponent  as keyof typeof asideComponentWidth].with }">
      <keep-alive>
        <component :is="currentSidebar" />
      </keep-alive>
    </el-aside>
    <el-main
      :class="['layout-wrap-right', asideComponent === 'DirectorySidebar' ? 'no-padding' : 'use-padding']"
      :style="{ padding: asideComponentWidth[asideComponent  as keyof typeof asideComponentWidth].padding }"
    >
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
const route = useRoute()

const currentSidebar = ref<null | any>(null)
const asideComponent = ref(route.meta.asideComponent)
const asideComponentWidth = {
  Sidebar: {
    with: '210px',
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
  console.log(`output->onMounted`, route.meta.asideComponent)
  loadSidebar(asideComponent.value)
})

watch(route, (newRoute) => {
  console.log(`output->watch`, route.meta.asideComponent)
  asideComponent.value = newRoute.meta.asideComponent
  loadSidebar(asideComponent.value)
})
</script>

<style lang="scss" scoped>
.layout-wrap {
  width: 100vw;
  height: 100vh;
  &-left {
    background-color: #fafafa;
    border-right: 1px solid rgba(0, 0, 0, 0.04);
    box-sizing: content-box;
  }
  .no-padding {
    padding: 0 !important;
  }
}
</style>

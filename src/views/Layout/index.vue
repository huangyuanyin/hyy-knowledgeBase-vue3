<template>
  <el-container class="layout-wrap">
    <el-aside class="layout-wrap-left" :style="{ width: asideComponent === 'DirectorySidebar' ? '345px' : '210px' }">
      <!-- <keep-alive> -->
      <component :is="currentSidebar" v-if="currentSidebar" />
      <!-- </keep-alive> -->
    </el-aside>
    <el-main :class="['layout-wrap-right', asideComponent === 'DirectorySidebar' ? 'no-padding' : 'use-padding']">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
const currentSidebar = ref<null | any>(null)
const route = useRoute()
const asideComponent = ref(route.meta.asideComponent)

const loadSidebar = (asideComponent) => {
  if (asideComponent) {
    currentSidebar.value = defineAsyncComponent(() => import(`../../components/${asideComponent}.vue`))
  } else {
    currentSidebar.value = null
  }
}

onMounted(() => {
  loadSidebar(asideComponent.value)
})

watch(route, (newRoute) => {
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
  .use-padding {
    padding: 26px 36px !important;
  }
  .no-padding {
    padding: 0px;
  }
}
</style>

<script lang="ts" setup>
import actionIcon from '@/assets/icons/actionIcon.svg'
import noteIcon from '@/assets/icons/noteIcon.svg'
import startIcon from '@/assets/icons/startIcon.svg'
import publicAreaIcon from '@/assets/icons/publicAreaIcon.svg'
import actionIcon_active from '@/assets/icons/actionIcon_active.svg'
import noteIcon_active from '@/assets/icons/noteIcon_active.svg'
import startIcon_active from '@/assets/icons/startIcon_active.svg'
import publicAreaIcon_active from '@/assets/icons/publicAreaIcon_active.svg'

interface MenuItem {
  index: string
  icon: string
  label: string
  id?: number
}

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  }
})

const route = useRoute()
const state = reactive({
  defaultMenu: 'dashboard'
})

watchEffect(() => {
  const routerName = router.currentRoute.value.name
  state.defaultMenu = route.meta.asideComponent === 'Sidebar' ? routerName.toString().toLowerCase() : routerName.toString().toLowerCase().split('-')[1]
})

const getIconPath = (iconName, isActive = false) => {
  const iconMap = {
    actionIcon: actionIcon,
    noteIcon: noteIcon,
    startIcon: startIcon,
    publicAreaIcon: publicAreaIcon
  }
  const activeIconMap = {
    actionIcon: actionIcon_active,
    noteIcon: noteIcon_active,
    startIcon: startIcon_active,
    publicAreaIcon: publicAreaIcon_active
  }

  return isActive ? activeIconMap[iconName] || '' : iconMap[iconName] || ''
}

const toLink = (menuItem: MenuItem) => {
  const queryParams = {
    sid: route.query.sid,
    sname: route.query.sname
  }

  switch (route.meta.asideComponent) {
    case 'SpaceSidebar':
      if (menuItem.index === 'public') {
        const path = route.path.split('/')[1]
        router.push({
          path: `/${path}/${menuItem.index}`,
          query: { ...queryParams, gid: menuItem.id, gname: menuItem.label }
        })
      } else {
        const path = route.path.split('/')[1]
        router.push({
          path: `/${path}/${menuItem.index}`,
          query: queryParams
        })
      }
      break
    default:
      router.push({
        path: `/${menuItem.index}`,
        query: queryParams
      })
      break
  }
}
</script>

<template>
  <div class="SidebarMenuItem-wrap">
    <el-menu :default-active="state.defaultMenu" class="menu-list" active-text-color="#262626" router>
      <template v-for="menuItem in props.menuItems" :key="menuItem.index">
        <el-menu-item :index="menuItem.index" @click="toLink(menuItem)">
          <img v-if="state.defaultMenu !== menuItem.index" :src="getIconPath(menuItem.icon)" alt="" />
          <img v-else :src="getIconPath(menuItem.icon, true)" alt="" />
          <span>{{ menuItem.label }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.SidebarMenuItem-wrap {
  .menu-list {
    border: none;
    background-color: #fafafa;
    :deep(.el-menu-item) {
      height: 32px;
      border-radius: 6px;
      margin: 2px 0;
      padding-left: 10px;
      img {
        margin-right: 10px;
      }
      &:hover {
        background-color: #eff0f0;
      }
    }
    :deep(.is-active) {
      background-color: #eff0f0;
    }
  }
}
</style>

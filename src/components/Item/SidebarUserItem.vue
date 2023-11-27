<template>
  <div class="sidebarUserItem-wrap">
    <div class="left">
      <img v-if="currentSider === 'Sidebar'" src="@/assets/favicon.ico" />
      <span v-if="currentSider === 'Sidebar'">信安</span>
      <img v-if="currentSider === 'SpaceSidebar'" :src="icon" />
      <span class="name" v-if="currentSider === 'SpaceSidebar'">{{ currentSiderName }}</span>
      <ChangeSpacePopver :currentSider="currentSider" />
    </div>
    <div class="right">
      <el-tooltip effect="dark" content="消息中心" placement="bottom">
        <span class="tongzhi">
          <svg-icon iconName="icon-tongzhi" className="tongzhi_svg"></svg-icon>
          <sub class="tongzhi-dot"></sub>
        </span>
      </el-tooltip>
      <UserPopver />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const currentSider = ref('')
const currentSiderName = ref('')
const icon = ref('')

watchEffect(() => {
  currentSider.value = route.meta.asideComponent as string
  currentSiderName.value = route.query?.sname as string
  console.log(`output->1212`, 1212)
})

onBeforeMount(() => {
  icon.value = JSON.parse(sessionStorage.getItem('currentSpaceInfo')).icon || '/src/assets/icons/spaceIcon.svg'
})
</script>

<style lang="scss" scoped>
.sidebarUserItem-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 26px;
      height: 26px;
      margin-right: 6px;
      border-radius: 4px;
    }
    span {
      color: #262626;
      font-size: 16px;
      font-weight: 900;
      margin-right: 6px;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      max-width: 115px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .tongzhi {
      position: relative;
      margin-right: 3px;
      padding: 5px;
      line-height: 20px;
      height: 20px;
      width: 20px;
      border-radius: 6px;
      display: block;
      text-align: center;
      &:hover {
        cursor: pointer;
        background-color: #eff0f0;
      }
      &-dot {
        background-color: #117cee;
        color: #ffff;
        position: absolute;
        top: 20%;
        right: 20%;
        width: 8px;
        height: 8px;
        border-radius: 100%;
      }
    }
  }
}
</style>

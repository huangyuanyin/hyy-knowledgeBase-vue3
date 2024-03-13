<script lang="ts" setup>
const infoStore = useInfoStore()
</script>

<template>
  <div class="Dynamic_wrap">
    <TeamHeader :icon="infoStore.currentTeamInfo.icon" />
    <Empty text="功能暂未开放，敬请期待" />
  </div>
</template>

<style lang="scss" scoped>
.Dynamic_wrap {
  width: 100%;
}
</style>

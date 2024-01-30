<script lang="ts" setup>
const props = defineProps({
  type: String
})

const router = useRouter()
const infoStore = useInfoStore()

const toPath = () => {
  if (infoStore.currentQuery.type === 'book') {
    router.push({
      path: `${infoStore.currentSpaceInfo.spacekey}/team/book`,
      query: {
        sid: infoStore.currentSpaceInfo?.id,
        sname: infoStore.currentSpaceInfo?.spacename,
        gid: infoStore.currentTeamInfo?.id,
        gname: infoStore.currentTeamInfo?.groupname
      }
    })
  }
}
</script>

<template>
  <div class="NoPermission_wrap">
    <div mt-196px flex flex-col items-center justify-center v-if="props.type === 'article'">
      <h3 text-24px text="#2626262" mb-12px>糟糕，文章无权限</h3>
      <div text-14px text="#8a8f8d">你可能暂无权限访问该文章，速去与管理员联系请求访问权限！</div>
    </div>
    <div mt-196px flex flex-col items-center justify-center v-else>
      <h3 text-24px text="#2626262" mb-12px>糟糕，页面无权限</h3>
      <div text-14px text="#8a8f8d" mb-24px>你可能暂无权限访问该页面，速去与管理员联系请求访问权限！</div>
      <el-button type="success" @click="toPath">返回</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.NoPermission_wrap {
  height: 100vh;
  padding: 60px 0;
  background: url(https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*TnZ4RLZZM8wAAAAAAAAAAAAAARQnAQ) no-repeat bottom;
  background-size: auto 80%;
  background-color: var(--yq-white);
  background-origin: content-box;
}
</style>

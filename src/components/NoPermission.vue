<script lang="ts" setup>
const props = defineProps({
  type: String
})

const route = useRoute()
const router = useRouter()
const path = ref('')
const content = {
  article: '文章',
  book: '知识库',
  team: '团队'
}
</script>

<template>
  <div class="NoPermission_wrap">
    <!-- <div class="article" v-if="props.type === 'article'">
      <el-result icon="error" title="暂无访问权限" sub-title="哎呦喂，你没有权限访问该文章，速去与管理员联系请求访问权限！">
        <template #extra>
          <el-button type="primary">看看别的文章吧</el-button>
        </template>
      </el-result>
    </div>
    <el-result v-else icon="error" title="暂无访问权限" sub-title="哎呦喂，你没有权限访问该模块，速去与管理员联系请求访问权限！">
      <template #extra>
        <el-button type="primary" @click="toPath">返回上一页</el-button>
      </template>
    </el-result> -->
    <div class="article">
      <el-result icon="error" title="暂无访问权限" :sub-title="`哎呦喂，你没有权限访问该${content[props.type]}，速去与管理员联系请求访问权限！`">
        <template #extra>
          <!-- <el-button type="primary">看看别的文章吧</el-button> -->
        </template>
      </el-result>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.NoPermission_wrap {
  height: 100%;
  .article {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

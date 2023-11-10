<script lang="ts" setup>
import { getLibraryDetailApi } from '@/api/library'

const route = useRoute()
const router = useRouter()
const refreshStroe = useRefreshStore()
const isComment = ref(true)
const isAutoPush = ref(false)
const isShowsDeleteDialog = ref(false)
const docSet = ref('1')
const bookId = ref(Number(route.query.lid) || null)
const deleteInfo = ref<{
  id?: string
  name?: string
  slug?: string
  space?: string
  group?: string
  stack?: string
}>({})

watchEffect(() => {
  if (refreshStroe.isRefreshBookList) {
    router.push({
      path: `/${route.path.split('/')[1]}/dashboard`,
      query: {
        sname: route.query.sname,
        sid: route.query.sid
      }
    })
  }
})

const toExport = () => {
  ElMessage.warning('该功能暂未开放，敬请期待')
}

const toMove = () => {
  ElMessage.warning('该功能暂未开放，敬请期待')
}

const getBooksDetail = async (id) => {
  let res = await getLibraryDetailApi(id)
  if (res.code === 1000) {
    const { id, name, slug, space, group, stack } = res.data as any
    Object.assign(deleteInfo.value, {
      id,
      name,
      slug,
      space,
      group,
      stack
    })
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getBooksDetail(bookId.value)
})
</script>

<template>
  <div class="Advanced_wrap">
    <div class="header">更多设置</div>
    <div class="box">
      <div class="box-item">
        <h3>文档设置</h3>
        <el-radio-group v-model="docSet" class="content">
          <el-radio label="1" size="large">
            <div class="option">
              <span>标准页宽</span>
              <p>文档展示宽度固定，不随浏览器宽度变化，适合以文字为主的文档</p>
            </div>
          </el-radio>
          <el-radio label="2" size="large" disabled>
            <div class="option">
              <span>超宽显示</span>
              <p>文档展示宽度根据浏览器自适应，适合含有超宽表格的文档</p>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="box-item">
        <h3>高级选项</h3>
        <el-checkbox v-model="isComment" size="large">
          <div class="option">
            <span>开启评论功能</span>
            <p>知识库默认开启评论功能，取消勾选后所有用户都无法评论。</p>
          </div>
        </el-checkbox>
        <el-checkbox v-model="isAutoPush" size="large" disabled>
          <div class="option">
            <span>开启自动发布</span>
            <p>文档保存时，自动将内容更新至阅读页。自动发布不会发送动态或消息。注意：打开开关并不会发布已有的文档</p>
          </div>
        </el-checkbox>
      </div>
      <div class="box-item">
        <h3>知识库设置</h3>
        <div class="item">
          <div class="left">
            <span>导出知识库</span>
            <p>可将知识库内容批量导出</p>
          </div>
          <el-button @click="toExport">导出</el-button>
        </div>
        <div class="item">
          <div class="left">
            <span>转移知识库</span>
            <p>可以将知识库转移到其他团队</p>
          </div>
          <el-button @click="toMove">转移</el-button>
        </div>
        <div class="item">
          <div class="left">
            <span>删除知识库</span>
            <p>将这个知识库彻底删除，知识库下的所有数据将会删除</p>
          </div>
          <el-button type="danger" @click="isShowsDeleteDialog = true">删除</el-button>
        </div>
      </div>
    </div>
  </div>

  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.Advanced_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    &-item {
      margin-bottom: 20px;
      h3 {
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #262626;
        flex: auto;
        display: flex;
        align-items: center;
        margin-bottom: 22px;
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        .el-radio {
          margin-bottom: 35px;
        }
        .option {
          margin-left: 4px;
          span {
            font-size: 14px;
            color: #262626;
          }
          p {
            line-height: 22px;
            margin-top: 6px;
            font-size: 14px;
            color: #8a8f8d;
          }
        }
      }
      .el-checkbox {
        margin-bottom: 35px;
        .option {
          margin-left: 4px;
          span {
            font-size: 14px;
            color: #262626;
          }
          p {
            line-height: 22px;
            margin-top: 6px;
            font-size: 14px;
            color: #8a8f8d;
          }
        }
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: #fafafa;
        border-radius: 8px;
        margin-bottom: 12px;
        span {
          font-size: 14px;
          color: #262626;
          line-height: 22px;
        }
        p {
          line-height: 22px;
          margin-top: 6px;
          font-size: 14px;
          color: #8a8f8d;
        }
      }
    }
  }
}
</style>

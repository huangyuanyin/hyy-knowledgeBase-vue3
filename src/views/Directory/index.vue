<script lang="ts" setup>
import { getLibraryDetailApi } from '@/api/library'
import { directoryIndexOperationData } from '@/data/data'

const route = useRoute()
const routeInfo = { route, router }
const articleStore = useArticleStore()
const isShowsDeleteDialog = ref(false)
const bookId = ref(route.query.lid as string)
const bookName = ref(route.query.lname)
const deleteInfo = ref({})

watch(
  () => route.query.lid,
  (newVal) => {
    if (newVal) {
      bookName.value = route.query.lname as string
      bookId.value = route.query.lid as string
    }
  }
)

watchEffect(() => {
  if (route.query.lid) {
    bookId.value = route.query.lid as string
    articleStore.getArticleList(bookId.value)
  }
})

const toDo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toShare = () => {
  const url = window.location.href
  useCopy(url, '分享链接')
}

const toMoreSetting = () => {
  useLink(routeInfo, 'fromBookToSet', {})
}

const toDeleteBook = () => {
  isShowsDeleteDialog.value = true
  const item = JSON.parse(sessionStorage.getItem('currentBookDetail') as string)
  deleteInfo.value = item
}

const getBookDetail = async (id) => {
  let res = await getLibraryDetailApi(id)
  if (res.code === 1000) {
    sessionStorage.setItem('currentBookDetail', JSON.stringify(res.data))
  } else {
    ElMessage.error(res.msg)
  }
}

// 跳转到文章详情
const toArticleDetail = (val) => {
  const spaceType = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
  switch (val.type) {
    case 'links':
      val.open_windows === '1' ? window.open(val.description) : (window.location.href = val.description)
      break
    case 'title':
      break
    default:
      useAddArticleAfterToLink(route, router, spaceType, val, false)
      break
  }
}

onMounted(() => {
  getBookDetail(bookId.value)
})
</script>

<template>
  <div class="Directory-wrap">
    <div class="container-box">
      <div class="container">
        <div class="header">
          <div class="header-left">
            <div class="bookIcon">
              <img src="/src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
            </div>
            <span>{{ bookName }}</span>
          </div>
          <div class="header-right">
            <div class="button-wrap">
              <div class="button" @click="toDo">
                <img src="@/assets/icons/startIcon.svg" alt="" />
                <span>收藏</span>
              </div>
              <div class="button" @click="toShare">
                <span>分享</span>
              </div>
              <LibraryOperationPopver
                :menuItems="directoryIndexOperationData"
                placement="bottom-end"
                @toRename="toDo"
                @toEditIndex="toDo"
                @toMoreSetting="toMoreSetting"
                @toDeleteBook="toDeleteBook"
              >
                <div class="button moreIcon">
                  <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
                </div>
              </LibraryOperationPopver>
            </div>
          </div>
        </div>
        <div class="count">
          <span><b>未统计</b>文档</span>
          <span><b>未统计</b>字</span>
        </div>
        <div class="welcome">
          <div class="welcome-item">
            <span> 👋 &ensp;</span>
            <span style="font-weight: 700">欢迎来到知识库</span>
          </div>
          <div class="welcome-item left">
            <span>知识库就像书一样，让多篇文档结构化，方便知识的创作与沉淀</span>
          </div>
        </div>
        <div class="list" v-if="articleStore.articleList.length">
          <el-tree :data="articleStore.articleList" node-key="id" :props="{ class: 'forumList' }" default-expand-all>
            <template #default="{ node, data }">
              <span class="list-node" @click="toArticleDetail(data)">
                <div class="title">
                  <div :class="['icon', !data.children?.length ? 'no-icon' : '']">
                    <img src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && node.expanded" />
                    <img class="foldIcon" src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && !node.expanded" />
                  </div>
                  <span>{{ data.title }}</span>
                </div>
                <span class="line" v-if="data.type !== 'l'"></span>
                <span class="time" v-if="data.type !== 'l'">{{ data.update_datetime }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="deleteInfo" @closeDialog="isShowsDeleteDialog = false" />
</template>

<style lang="scss" scoped>
.Directory-wrap {
  padding: 0;
  width: 100%;
  min-height: calc(100vh - 60px);
  will-change: padding-left;
  background: linear-gradient(rgba(255, 255, 255, 0) 0px, rgb(255, 255, 255) 70vh, rgb(255, 255, 255) 100%), url('@/assets/img/cover.png') center top / 100% no-repeat;
  .container-box {
    padding: 64px 32px 0 32px;
    min-height: 100vh;
    position: relative;
    box-sizing: border-box;
    .container {
      max-width: 1024px;
      background: hsla(0, 0%, 100%, 0.9);
      border-radius: 12px;
      padding: 32px;
      min-height: calc(100vh - 64px);
      margin: 0 auto;
      box-sizing: border-box;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        .header-left {
          display: flex;
          align-items: center;
          height: 44px;
          .bookIcon {
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 38px;
              min-width: 38px;
              height: 38px;
            }
          }
          span {
            font-size: 28px;
            font-weight: 700;
            margin-left: 18px;
            font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
              sans-serif;
          }
        }
        .header-right {
          display: flex;
          align-items: center;
          .button-wrap {
            display: flex;
            align-items: center;
            .button {
              display: flex;
              align-items: center;
              border: 1px solid #e7e9e8;
              border-radius: 6px;
              text-align: center;
              padding: 7px 14px;
              min-width: 32px;
              height: 32px;
              margin: 0 0 0 12px;
              cursor: pointer;
              box-sizing: border-box;
              img {
                width: 16px;
                height: 16px;
                margin-right: 6px;
              }
              span {
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
              }
              &:hover {
                background-color: #fafafa;
              }
            }

            .moreIcon {
              padding-left: 7px;
              padding-right: 7px;
              img {
                margin-right: 0px;
              }
            }
          }
        }
      }
      .count {
        margin: 6px 0 6px 58px;
        height: 28px;
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          color: #8a8f8d;
          text-align: center;
          margin-right: 33px;
          b {
            color: #585a5a;
            font-family: DIN Alternate Bold, Pingfang SC, Hiragino Sans GB, Helvetica, Droid Sans, Microsoft YaHei, Arial, sans-serif;
            font-size: 18px;
            margin-right: 8px;
            font-weight: 700;
          }
        }
      }
      .welcome {
        margin-top: 60px;
        &-item {
          min-height: 24px;
          margin-bottom: 8px;
          font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Segoe UI';
          span {
            font-size: 15px;
          }
        }
        .left {
          text-indent: 2em;
        }
      }
      .list {
        margin-top: 60px;
        padding: 0 8px;
        width: 100%;
        :deep(.el-tree) {
          background-color: transparent;
        }
        :deep(.el-tree-node__expand-icon) {
          display: none;
        }
        :deep(.forumList) {
          width: 100%;
          .el-tree-node__content {
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
            border-radius: 6px;
            height: 34px;
            color: #262626;
            padding-right: 6px;
            border: 1.5px solid transparent;
            margin-bottom: 2px;
          }
          .list-node {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
              display: flex;
              align-items: center;
              font-size: 15px;
              font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
                sans-serif;
              .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                transition: transform 0.2s ease;
                border-radius: 6px;
                margin-right: 4px;
                transition: background 0.35s ease-in-out;
                img {
                  width: 16px;
                  min-width: 16px;
                  height: 16px;
                }
                &:hover {
                  background-color: #d8dad9;
                }
                .foldIcon {
                  transform: rotate(-90deg);
                  transition: transform 0.3s;
                }
              }
              .no-icon {
                &:hover {
                  background-color: transparent;
                }
              }
            }
            .line {
              flex: 1;
              margin: 0 16px;
              border-top: 1px dashed #d8dad9;
            }
            .time {
              font-size: 14px;
              color: #8a8f8d;
              font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
                sans-serif;
            }
          }
        }
      }
    }
  }
}
</style>

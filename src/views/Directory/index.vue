<script lang="ts" setup>
import startIconSelect from '@/assets/icons/startIcon_select.svg'
import startIcon from '@/assets/icons/startIcon.svg'
import { directoryIndexOperationData } from '@/data/data'
import { TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'

interface BookInfo {
  id: number
  name: string
  group: number
}

const route = useRoute()
const routeInfo = { route, router }
const infoStore = useInfoStore()
const isShowsDeleteDialog = ref<boolean>(false)
const bookBulletin = ref<string>('')
const toolbar = 'blocks fontsize bold  align bullist numlist  lineheight  link  hr  tableofcontents tableofcontentsupdate | emoticons image fullscreen  preview autolink  '
const isEdit = ref<boolean>(false)
const defaultProps = {
  class: 'forumList'
} as unknown as TreeOptionProps

const { lid = '', lname = '' } = infoStore.currentQuery || {}

const { addCollect } = useCollect()

const toDo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toMark = () => {
  if (!infoStore.currentBookInfo.marked) {
    addCollect(lid, (res: any) => {
      if (Reflect.ownKeys(res).length) {
        useBook().getBookInfo(res.target_id, (val: any) => {
          if (Reflect.ownKeys(val).length) {
            getBookDetail()
          }
        })
      }
    })
  }
}

const cancelMark = () => {
  useBook().getBookInfo(Number(lid), (res: any) => {
    if (Reflect.ownKeys(res).length) {
      getBookDetail()
    }
  })
}

const toShare = () => {
  const url = window.location.href
  useCopy(url, '分享链接')
}

const toMoreSetting = () => {
  useLink(routeInfo, 'fromBookToSet', {})
}

const toUpdateBulletin = () => {
  const { space, group, stacks, name, slug, public: p } = infoStore.currentBookInfo
  const params = {
    body: bookBulletin.value,
    space,
    group,
    stacks,
    slug,
    name,
    public: p
  }
  useBook().editBook(Number(lid), params, (res: BookInfo) => {
    if (Reflect.ownKeys(res).length) {
      ElMessage.success('更新成功')
      isEdit.value = false
      useBook().getBookInfo(res.id, (res: any) => {
        if (Reflect.ownKeys(res).length) {
          getBookDetail()
        }
      })
    }
  })
}

const getBookDetail = async () => {
  bookBulletin.value = infoStore.currentBookInfo.body
}

// 跳转到文章详情
const toArticleDetail = (val) => {
  switch (val.type) {
    case 'links':
      val.open_windows === '1' ? window.open(val.description) : (window.location.href = val.description)
      break
    default:
      useLinkHooks().handleArticleTypeLink(val, false)
      break
  }
}

onMounted(() => {
  getBookDetail()
})
</script>

<template>
  <div class="Directory-wrap">
    <div class="container-box">
      <div class="container">
        <div class="header">
          <div class="header-left">
            <div class="bookIcon">
              <img :src="infoStore.currentBookInfo.icon" alt="" class="bookIcon" />
            </div>
            <span max-w-31vw overflow-hidden text-ellipsis whitespace-nowrap>{{ lname }}</span>
          </div>
          <div class="header-right">
            <div class="button-wrap" v-if="!isEdit">
              <StarPopver @cancelMark="cancelMark" :startId="infoStore.currentBookInfo.mark_id" :tag_mark="infoStore.currentBookInfo.tag_mark" type="book">
                <div class="button" @click="toMark">
                  <img :src="infoStore.currentBookInfo.marked ? startIconSelect : startIcon" alt="" />
                  <span>{{ infoStore.currentBookInfo.marked ? '已收藏' : '收藏' }}</span>
                </div>
              </StarPopver>
              <div class="button" @click="toShare">
                <span>分享</span>
              </div>
              <LibraryOperationPopver
                :menuItems="directoryIndexOperationData"
                placement="bottom-end"
                @toRename="toDo"
                @toEditIndex="isEdit = true"
                @toMoreSetting="toMoreSetting"
                @toDeleteBook="isShowsDeleteDialog = true"
              >
                <div class="button moreIcon">
                  <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
                </div>
              </LibraryOperationPopver>
            </div>
            <div v-else>
              <div
                flex
                items-center
                border="1px solid #e7e9e8"
                rounded-6px
                h-32px
                mr-12px
                border-box
                cursor-pointer
                text-center
                p-7px
                pr-14px
                pl-14px
                min-w-32px
                @click="toUpdateBulletin"
                hover="bg-#fafafa"
              >
                <span font-700 text-14px line-h-20px>更新</span>
              </div>
            </div>
          </div>
        </div>
        <div class="count">
          <span><b>未统计</b>文档</span>
          <span><b>未统计</b>字</span>
        </div>
        <div class="welcome" v-if="!isEdit && bookBulletin === ''">
          <div class="welcome-item">
            <span> 👋 &ensp;</span>
            <span style="font-weight: 700">欢迎来到知识库</span>
          </div>
          <div class="welcome-item left">
            <span>知识库就像书一样，让多篇文档结构化，方便知识的创作与沉淀</span>
          </div>
        </div>
        <MavonEditor mt-60px :html="bookBulletin" :navigation="false" v-else-if="!isEdit && bookBulletin" />
        <div mt-60px border="1px solid #e7e9e8" rounded-4px v-if="isEdit">
          <TinyMCE v-model="bookBulletin" :resize="true" height="500px" :toolbar="toolbar" body-style="body { margin: 1rem 2% 1rem 2% }" />
        </div>
        <div class="list" v-if="infoStore.currentArticleTreeInfo?.length">
          <el-tree :data="infoStore.currentArticleTreeInfo" node-key="id" :props="defaultProps" default-expand-all>
            <template #default="{ node, data }">
              <span class="list-node">
                <div class="title">
                  <div :class="['icon', !data.children?.length ? 'no-icon' : '']">
                    <img src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && node.expanded" />
                    <img class="foldIcon" src="@/assets/icons/miniDropDownIcon.svg" alt="" v-if="data.children?.length && !node.expanded" />
                  </div>
                  <span @click="toArticleDetail(data)">{{ data.title }}</span>
                </div>
                <span class="line" v-if="data.type !== 'title'" @click="toArticleDetail(data)"></span>
                <span class="time" v-if="data.type !== 'title'">{{ data.update_datetime }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
  <DeleteDialog :isShow="isShowsDeleteDialog" :deleteInfo="infoStore.currentBookInfo" @closeDialog="isShowsDeleteDialog = false" />
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
      :deep(.markdown-body) {
        border: none;
        min-height: 100px;
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

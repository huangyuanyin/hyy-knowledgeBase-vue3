<script lang="ts" setup>
import inputComment from '@/assets/icons/drawer/inputComment.svg'
import { getCommentsApi, addCommentsApi, deleteCommentsApi } from '@/api/comments'
import CommentItem from '@/components/Drawer/CommentDrawer/comment.vue'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toCloseDrawer'])

const route = useRoute()
const aid = ref('')
const commenting = ref(false)
const commentValue = ref('')
const commentList = ref([])
const replyValue = ref('')
const replyId = ref(null)
const commentTotal = ref(0)

watch(
  () => props.drawer,
  (val) => {
    if (val) {
      aid.value = route.query.aid as string
      getComments()
    }
  }
)

const handleClose = () => {
  commentValue.value = ''
  commenting.value = false
  emit('toCloseDrawer')
}

const toReply = (item: any) => {
  replyValue.value = ''
  replyId.value = item.id
}

const toCancelReply = () => {
  replyValue.value = ''
  replyId.value = null
}

const toDeleteComment = async (item: any) => {
  let res = await deleteCommentsApi(item.id)
  if (res.code === 1000) {
    getComments()
  } else {
    ElMessage.error(res.msg)
  }
}

const addComments = async (type) => {
  if (type === 'comment') {
    const params = {
      content: Number(aid.value),
      body: commentValue.value
    }
    let res = await addCommentsApi(params)
    if (res.code === 1000) {
      commentValue.value = ''
      commenting.value = false
      getComments()
    } else {
      ElMessage.error(res.msg)
    }
  } else {
    const params = {
      content: Number(aid.value),
      body: type.data.body,
      parent: type.data.id
    }
    let res = await addCommentsApi(params)
    if (res.code === 1000) {
      replyValue.value = ''
      replyId.value = null
      getComments()
    } else {
      ElMessage.error(res.msg)
    }
  }
}

const getComments = async () => {
  const params = {
    content: aid.value
  }
  let res = await getCommentsApi(params)
  if (res.code === 1000) {
    commentTotal.value = res.data.length
    commentList.value = arrayToTree(res.data)
  } else {
    ElMessage.error(res.msg)
  }
}

const arrayToTree = (list) => {
  const map = {}
  const result = []
  // 构建map
  list.forEach((item) => {
    map[item.id] = { ...item, children: [] }
  })
  // 遍历处理
  list.forEach((item) => {
    // 找到父节点
    const parent = map[item.parent]
    // 没有父节点,即根节点
    if (!parent) {
      result.push(map[item.id])
      // 有父节点
    } else {
      // 父节点的父节点
      const grandpa = map[parent.parent]
      // 如果存在祖父节点
      if (grandpa) {
        // 将当前节点放入祖父节点的子节点里
        grandpa.children.push(map[item.id])
        // 如果没有祖父节点
      } else {
        // 放入父节点的子节点里
        parent.children.push(map[item.id])
      }
    }
  })
  return result
}
</script>

<template>
  <el-drawer
    v-model="props.drawer"
    modal-class="CommentDrawer_modal"
    custom-class="CommentDrawer_wrap"
    :title="`评论（${commentTotal}）`"
    :modal="false"
    size="305px"
    @close="handleClose"
  >
    <div class="comment-list">
      <div v-if="commentList.length > 0" class="list">
        <div class="item" v-for="(item, index) in commentList" :key="index">
          <CommentItem
            :parent="null"
            :data="item"
            :replyId="replyId"
            :replyValue="replyValue"
            @toReply="toReply"
            @toCancelReply="toCancelReply"
            @addComments="addComments"
            @toDeleteComment="toDeleteComment"
          />
          <template v-if="item.children">
            <div class="item-bottom" v-for="(it, index) in item.children" :key="'children' + index">
              <CommentItem
                :parent="null"
                :data="it"
                :replyId="replyId"
                :replyValue="replyValue"
                @toReply="toReply"
                @toCancelReply="toCancelReply"
                @addComments="addComments"
                @toDeleteComment="toDeleteComment"
              />
              <template v-if="it.children">
                <div class="item-bottom three" v-for="(q, index) in it.children" :key="'children' + index">
                  <CommentItem
                    :parent="it"
                    :data="q"
                    :replyId="replyId"
                    :replyValue="replyValue"
                    @toReply="toReply"
                    @toCancelReply="toCancelReply"
                    @addComments="addComments"
                    @toDeleteComment="toDeleteComment"
                  />
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="empty" v-else>暂无评论</div>
    </div>
    <div class="submit_wrap">
      <div class="input_wrap" :style="{ height: !commenting ? '' : '194px' }">
        <div class="input" @click="commenting = true" v-if="!commenting">
          <img :src="inputComment" alt="" />
          <span>输入全文评论</span>
        </div>
        <div class="comment" v-else>
          <el-input v-model="commentValue" :rows="5" type="textarea" placeholder="" />
          <div>
            <el-button :class="['submit', commentValue === '' ? 'disabled' : '']" :disabled="commentValue === ''" type="" @click="addComments('comment')">评论</el-button>
            <el-button class="cancel" link @click="commenting = false">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.CommentDrawer_modal {
  position: fixed !important;
  top: 52px !important;
  left: 100vh !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.CommentDrawer_wrap {
  position: fixed !important;
  top: 52px !important;
  right: 0px !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 305px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
  border-left: 1px solid rgba(0, 0, 0, 0.04) !important;
  .el-drawer__header {
    margin-bottom: 0;
    height: 52px;
    display: flex;
    align-items: center;
    padding-top: 0;
    span {
      font-size: 14px;
      color: #262626;
      font-weight: 700;
    }
  }
  .el-drawer__body {
    padding: 0;
  }
  .comment-list {
    min-height: calc(100vh - 104px);
    padding-bottom: 56px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    .empty {
      padding: 20px;
      color: #8a8f8d;
      font-size: 14px;
      box-sizing: border-box;
    }
    .list {
      .item {
        padding: 20px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        .item-top {
          display: flex;
          margin-bottom: 20px;
          .avatar {
            padding-right: 12px;
            box-sizing: border-box;
            img {
              width: 24px;
              height: 24px;
              border-radius: 12px;
            }
          }
          .content {
            flex: 1;
            .name {
              color: #585a5a;
              font-size: 14px;
              line-height: 22px;
            }
            .time {
              font-size: 12px;
              color: #8a8f8d;
              line-height: 22px;
            }
            .text {
              margin-top: 8px;
            }
          }
          .operation {
            margin-left: -4px;
            margin-top: 6px;
            display: flex;
            span {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 24px;
              height: 24px;
              border-radius: 3px;
              margin-right: 8px;
              img {
                width: 16px;
                height: 16px;
              }
              &:hover {
                background-color: #eff0f0;
                cursor: pointer;
              }
            }
          }
          .reply {
            margin-top: 16px;
            div {
              margin-top: 12px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .el-button {
                height: 32px;
                border-radius: 6px;
              }
              .cancel,
              .submit {
                &:hover {
                  border-color: #009456;
                  color: #009456;
                  background-color: transparent;
                }
              }
              .disabled {
                background-color: transparent;
                border-color: #d9d9d9;
                color: #bec0bf;
                &:hover {
                  border-color: #d9d9d9;
                  color: #bec0bf;
                  background-color: transparent;
                }
              }
            }
          }
          // 如果是最后一个item-top
          &:last-child {
            margin-bottom: 0;
          }
        }

        .item-bottom {
          padding-left: 36px;
          box-sizing: border-box;
        }
        .three {
          padding-left: 0px !important;
          .name {
            display: flex !important;
            align-items: center !important;
            max-width: 100% !important;
            span {
              max-width: 70px !important;
              margin-right: 10px !important;
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            img {
              margin-right: 6px;
              // 逆时针旋转90度
              transform: rotate(-90deg);
            }
          }
        }
      }
      .item:last-child {
        border-bottom: none;
      }
    }
  }
  .submit_wrap {
    position: absolute;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 1px rgba(0, 0, 0, 0.02);
    .input_wrap {
      padding: 12px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
      cursor: text;
      .input {
        display: flex;
        align-items: center;
        width: 100%;
        height: 32px;
        padding: 0 10px;
        background-color: #f4f5f5;
        border-radius: 6px;
        span {
          font-size: 14px;
          color: #bec0bf;
          margin-left: 4px;
        }
      }
      .comment {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        padding: 0 10px;
        border-radius: 6px;
        box-sizing: border-box;
        div {
          display: flex;
          align-items: center;
        }
        .submit {
          background: #00b96b;
          border-color: #00b96b;
          height: 32px;
          border-radius: 6px;
          color: #fff;
          span {
            font-size: 14px;
            font-weight: 700;
            color: #fff;
          }
        }
        .disabled {
          background: #afe6cf;
          border-color: #afe6cf;
        }
        .cancel {
          height: 32px;
          color: #8a8f8d;
          border: none;
        }
        .el-button {
          margin-top: 12px;
        }
      }
    }
  }
}
</style>

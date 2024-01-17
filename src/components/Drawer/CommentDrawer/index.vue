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

const infoStore = useInfoStore()
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
      aid.value = infoStore.currentQuery?.aid
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
    size="315px"
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
                :parent="item"
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
      <div class="input_wrap" :style="{ height: !commenting ? '' : 'auto' }">
        <div class="input" @click="commenting = true" v-if="!commenting">
          <img :src="inputComment" alt="" />
          <span>输入全文评论</span>
        </div>
        <div class="comment" v-else>
          <Tiptap v-model="commentValue" :disabled="false" />
          <div>
            <el-button
              :class="['submit', commentValue === '' || commentValue === '<p></p>' ? 'disabled' : '']"
              :disabled="commentValue === '' || commentValue === '<p></p>'"
              type=""
              @click="addComments('comment')"
              >评论</el-button
            >
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
  max-width: 315px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.CommentDrawer_wrap {
  position: fixed !important;
  top: 52px !important;
  right: 0px !important;
  height: calc(100vh - 52px) !important;
  max-height: calc(100vh - 52px) !important;
  max-width: 315px !important;
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
    &::-webkit-scrollbar {
      width: 4px;
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
      cursor: pointer;
    }
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
        .item-bottom {
          padding-left: 36px;
          box-sizing: border-box;
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0px;
          }
        }
        .three {
          padding-left: 0px !important;
          margin-bottom: 0px;
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

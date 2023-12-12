<script lang="ts" setup>
import commentIcon from '@/assets/icons/comment/comment.svg'
import deleteIcon from '@/assets/icons/comment/delete.svg'
import editIcon from '@/assets/icons/comment/edit.svg'
import downIcon from '@/assets/icons/downIcon.svg'
import { WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  replyValue: {
    type: String,
    default: ''
  },
  parent: {
    type: Object,
    default: () => ({})
  },
  replyId: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['toReply', 'toCancelReply', 'addComments', 'toDeleteComment'])

const replyValue = ref(props.replyValue)

watch(
  () => props.replyValue,
  (val) => {
    replyValue.value = val
  }
)

const toCancelReply = () => {
  replyValue.value = ''
  emit('toCancelReply')
}

const toReply = (data: any) => {
  emit('toReply', data)
}

const addComments = (type: string, id: number) => {
  const data = {
    id,
    body: replyValue.value
  }
  replyValue.value = ''
  emit('addComments', { type, data })
}

const toDeleteComment = (data: any) => {
  emit('toDeleteComment', data)
}
</script>

<template>
  <div class="comment_wrap" :style="{ 'margin-bottom': props.data.children.length ? '20px' : ' 0px' }">
    <div class="avatar">
      <img :src="props.data.avatar || '/src/assets/img/img.jpg'" alt="" />
    </div>
    <div class="content">
      <div class="name">
        <span>{{ props.data.creator }}</span>
        <img v-if="props.parent" :src="downIcon" />
        <span v-if="props.parent">{{ props.parent.creator }}</span>
      </div>
      <div class="time">{{ props.data.create_datetime }}</div>
      <div class="text">{{ props.data.body }}</div>
      <div class="operation">
        <span @click="toReply(props.data)"><img :src="commentIcon" /></span>
        <span><img :src="editIcon" /></span>
        <el-popconfirm
          width="232"
          confirm-button-text="确定"
          cancel-button-text="取消"
          confirm-button-type="success"
          :icon="WarningFilled"
          icon-color="#ecaa04"
          title="确认删除该评论么？"
          @confirm="toDeleteComment(props.data)"
        >
          <template #reference>
            <span><img :src="deleteIcon" /></span>
          </template>
        </el-popconfirm>
      </div>
      <div class="reply" v-if="replyId === props.data.id">
        <el-input v-model="replyValue" :rows="5" type="textarea" :placeholder="`回复 ${props.data.creator}`" />
        <div>
          <el-button class="cancel" @click="toCancelReply">取消</el-button>
          <el-button :class="['submit', replyValue === '' ? 'disabled' : '']" :disabled="replyValue === ''" type="" @click="addComments('reply', props.data.id)">回复</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment_wrap {
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
      display: flex;
      align-items: center;
      max-width: 100%;
      color: #585a5a;
      font-size: 14px;
      line-height: 22px;
      span {
        max-width: 70px;
        margin-right: 10px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img {
        margin-right: 6px;
        transform: rotate(-90deg);
      }
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
</style>

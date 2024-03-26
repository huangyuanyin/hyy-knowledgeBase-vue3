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
  editValue: {
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
  },
  editId: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['toReply', 'toEditComment', 'toCancelReply', 'toCancelEdit', 'addComments', 'editComments', 'toDeleteComment'])

const replyValue = ref(props.replyValue)
const editValue = ref(props.editValue)
const avatar = 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo') || '{}').avatar

watch(
  () => props.replyValue,
  (val) => {
    replyValue.value = val
  }
)

watch(
  () => props.editValue,
  (val) => {
    editValue.value = val
  }
)

const toCancelReply = () => {
  replyValue.value = ''
  emit('toCancelReply')
}

const toCancelEdit = () => {
  editValue.value = props.editValue
  emit('toCancelEdit', editValue.value)
}

const toReply = (data: any) => {
  emit('toReply', data)
}

const toEditComment = (data: any) => {
  emit('toEditComment', data)
}

const addComments = (type: string, id: number) => {
  const data = {
    id,
    body: replyValue.value
  }
  replyValue.value = ''
  emit('addComments', { type, data })
}

const editComments = (type: string, id: number) => {
  const data = {
    id,
    body: editValue.value
  }
  emit('editComments', { type, data })
}

const toDeleteComment = (data: any) => {
  emit('toDeleteComment', data)
}
</script>

<template>
  <!-- <div class="comment_wrap" :style="{ 'margin-bottom': props.data.children.length ? '20px' : ' 0px' }"> -->
  <div class="comment_wrap" :style="{ 'margin-bottom': '20px' }">
    <div class="avatar">
      <img :src="props.data.avatar || avatar" alt="" />
    </div>
    <div class="content">
      <div class="name">
        <span :class="[!props.parent ? 'master' : '']">{{ props.data.creator_name }}</span>
        <img v-if="props.parent" :src="downIcon" />
        <span v-if="props.parent" items-center w-full style="max-width: 100px; display: flex">
          <img style="transform: none" mr-12px w-24px h-24px rounded-12px :src="props.data.avatar || avatar" alt="" />
          {{ props.data.parent_name }}
        </span>
      </div>
      <div class="time">{{ props.data.update_datetime }}</div>
      <div class="text" v-if="editId !== props.data.id">
        <Tiptap v-model="props.data.body" disabled />
      </div>
      <div class="text2" v-else>
        <Tiptap v-model="editValue" />
      </div>
      <div class="operation">
        <span @click="toReply(props.data)"><img :src="commentIcon" /></span>
        <span @click="toEditComment(props.data)"><img :src="editIcon" /></span>
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
        <Tiptap v-model="replyValue" :placeholder="`回复 ${props.data.creator_name}`" />
        <div>
          <el-button class="cancel" @click="toCancelReply">取消</el-button>
          <el-button :class="['submit', replyValue === '' ? 'disabled' : '']" :disabled="replyValue === ''" type="" @click="addComments('reply', props.data.id)">
            回复 {{ props.data.creator_name }}
          </el-button>
        </div>
      </div>
      <div class="edit" v-if="editId === props.data.id">
        <div>
          <el-button :class="['submit', editValue === '' ? 'disabled' : '']" :disabled="editValue === ''" type="" @click="editComments('reply', props.data.id)"> 提交 </el-button>
          <el-button class="cancel" @click="toCancelEdit">取消</el-button>
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
    position: relative;
    flex: 1;
    .name {
      display: flex;
      align-items: center;
      max-width: 100%;
      color: #585a5a;
      font-size: 14px;
      line-height: 22px;
      .master {
        max-width: max-content !important;
      }
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
      :deep(.tiptap) {
        padding: 4px 0px 0px 0px !important;
      }
    }
    .text2 {
      :deep(.tiptap) {
        padding: 12px 12px 44px 12px !important;
      }
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
  .edit,
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
  .edit {
    margin-top: 0px;
    div {
      justify-content: flex-start !important;
    }
    .submit {
      border-color: rgba(46, 215, 144);
      color: #262626;
      background-color: rgba(46, 215, 144);
      &:hover {
        border-color: #298e64 !important;
        background-color: #298e64 !important;
        color: #141414 !important;
      }
    }
  }

  // 如果是最后一个item-top
  &:last-child {
    margin-bottom: 0;
  }
}
</style>

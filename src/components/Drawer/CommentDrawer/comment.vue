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
  <div class="item-top" :style="{ 'margin-bottom': props.data.children.length ? '20px' : ' 0px' }">
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

<style lang="scss" scoped></style>

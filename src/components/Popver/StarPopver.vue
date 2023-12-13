<script lang="ts" setup>
import { deleteMarksApi, editMarksApi } from '@/api/marks'
import { addTagApi, getTagApi } from '@/api/tag'
import { OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 282,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  startId: '',
  tag_mark: '',
  type: '',
  target_id: ''
})
const emit = defineEmits(['cancelMark'])

const route = useRoute()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const starPopverRef = ref(null)
const tagList = ref([])
const tagValue = ref('')
const isShowsGroupDialog = ref(false)

watchEffect(() => {
  tagValue.value = props.tag_mark
})

const changeTag = async () => {
  const params = {
    space: route.query.sid as string,
    tags_id: tagValue.value,
    target_id: props.type === 'book' ? (route.query.lid as string) : props.type === 'star' ? props.target_id : (route.query.aid as string)
  }
  let res = await editMarksApi(Number(props.startId), params)
  if (res.code === 1000) {
    ElMessage.success('操作成功')
    props.type === 'star' ? refreshStroe.setRefreshMark(true) : ''
  } else {
    ElMessage.error(res.msg)
  }
}

const toAddTag = (name: string) => {
  addTags(name)
}

const addTags = async (name: string) => {
  const params = {
    space: route.query.sid as string,
    name,
    action_type: 'mark'
  }
  let res = await addTagApi(params)
  if (res.code === 1000) {
    isShowsGroupDialog.value = false
    getTags()
    ElMessage.success('新建分组成功')
  } else {
    ElMessage.error(res.msg)
  }
}

const getTags = async () => {
  const params = {
    space: route.query.sid as string,
    creator: user,
    action_type: 'mark'
  }
  let res = await getTagApi(params)
  if (res.code === 1000) {
    tagList.value = res.data as any
  } else {
    ElMessage.error(res.msg)
  }
}

const deleteMarks = async () => {
  let res = await deleteMarksApi(Number(props.startId))
  if (res.code === 1000) {
    starPopverRef.value && starPopverRef.value.hide()
    ElMessage.success('取消收藏')
    emit('cancelMark')
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getTags()
})
</script>

<template>
  <el-popover
    ref="starPopverRef"
    popper-class="starPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <div class="box">
      <div class="header">
        <span>选择分组</span>
        <p>你可以选择分组或直接<el-button type="primary" link @click="deleteMarks">取消收藏</el-button></p>
      </div>
      <div class="empty" v-if="!tagList.length">
        <span>暂无分组</span>
      </div>
      <div class="tag">
        <el-radio-group v-model="tagValue" @change="changeTag">
          <el-radio :label="String(item.id)" v-for="(item, index) in tagList" :key="'tagList' + index">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
      <div class="bottom" @click="isShowsGroupDialog = true"><i-ep-Plus />新建分组</div>
    </div>
    <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTag="toAddTag" title="新建分组" />
  </el-popover>
</template>
<style lang="scss" scoped>
.starPopver {
  .box {
    .header {
      padding: 14px 16px 0;
      box-sizing: border-box;
      span {
        font-size: 16px;
        color: #262626;
        margin-bottom: 4px;
        font-weight: 500;
      }
      p {
        font-size: 14px;
        color: #8a8f8d;
        display: flex;
        align-items: center;
      }
    }
    .empty {
      min-height: 65px;
      max-height: 287px;
      overflow: auto;
      padding: 20px 16px 12px 16px;
      color: #262626;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        color: #8a8f8d;
        text-align: center;
        line-height: 26px;
      }
    }
    .tag {
      min-height: 65px;
      max-height: 287px;
      overflow: auto;
      padding: 20px 16px 12px 16px;
      box-sizing: border-box;
      .el-checkbox-group,
      .el-radio-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .bottom {
      border-top: 1px solid #e7e9e8;
      height: 52px;
      line-height: 52px;
      font-size: 14px;
      color: #585a5a;
      padding-left: 16px;
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      svg {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }
}
</style>

<style lang="scss">
.starPopver {
  padding: 0px !important;
}
</style>

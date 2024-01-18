<script lang="ts" setup>
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

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const starPopverRef = ref(null)
const tagList = ref([])
const tagValue = ref('')
const isShowsGroupDialog = ref(false)

const { tagList: tList, getTagList, addTag } = useTag()
const { editCollect, deleteCollect } = useCollect()

watchEffect(() => {
  tagValue.value = props.tag_mark
})

const toShow = () => {
  toGetTagList()
}

const toChangeTag = async () => {
  editCollect(
    Number(props.startId),
    {
      tags_id: tagValue.value,
      target_id: props.type === 'book' ? infoStore.currentQuery?.lid : props.type === 'star' ? props.target_id : infoStore.currentQuery?.aid
    },
    () => {
      props.type === 'star' ? refreshStroe.setRefreshMark(true) : ''
    }
  )
}

const toAddTag = (name: string) => {
  addTag(name, () => {
    isShowsGroupDialog.value = false
    toGetTagList()
    refreshStroe.setRefreshMark(true)
  })
}

const toGetTagList = async () => {
  await getTagList()
  tagList.value = tList.value
}

const toDeleteCollect = async () => {
  deleteCollect(Number(props.startId), () => {
    starPopverRef.value && starPopverRef.value.hide()
    emit('cancelMark')
  })
}
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
    @show="toShow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <div class="box">
      <div class="header">
        <span>选择分组</span>
        <p>你可以选择分组或直接<el-button type="primary" link @click="toDeleteCollect">取消收藏</el-button></p>
      </div>
      <div class="empty" v-if="!tagList.length">
        <span>暂无分组</span>
      </div>
      <div class="tag" v-else>
        <el-radio-group v-model="tagValue" @change="toChangeTag">
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

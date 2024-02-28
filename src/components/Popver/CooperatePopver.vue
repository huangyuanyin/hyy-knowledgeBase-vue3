<script lang="ts" setup>
// import { cooperateLink } from '@/data/data'
import { OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 422,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  userList: [],
  selectUserList: [] // 可协作人员列表
})

const emit = defineEmits(['updateArticleCollaborations'])

const updateArticleCollaborations = () => {
  emit('updateArticleCollaborations', true)
}

const cooperatePopverRef = ref(null)
// const link = ref(cooperateLink)
</script>

<template>
  <el-popover
    ref="cooperatePopverRef"
    popper-class="cooperatePopverPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <div class="cooperate-icon" style="display: flex; align-items: center; justify-content: center">
        <img src="@/assets/icons/cooperateIcon.svg" alt="" />
      </div>
    </template>
    <div class="box">
      <div class="box-top">
        <span>文档协作者</span>
      </div>
      <CooperatePopverItem :userList="props.userList" :selectUserList="props.selectUserList" @updateArticleCollaborations="updateArticleCollaborations" />
    </div>
  </el-popover>
</template>
<style lang="scss" scoped>
.cooperatePopverPopver {
  box-sizing: border-box;
  .box {
    &-top {
      padding: 20px 20px 0 20px;
      span {
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.cooperatePopverPopver {
  padding: 0 !important;
}
.cooperatePopverPopver-search-list {
  padding: 0 8px !important;
  .is-loading {
    box-sizing: border-box;
    width: 100%;
    li {
      height: 50px;
      line-height: 50px;
    }
  }
  ul {
    li {
      box-sizing: border-box;
      height: 48px;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 6px;
      color: #262626;
      padding: 0 8px;
      width: 100%;
      img {
        width: 32px;
        min-width: 32px;
        height: 32px;
        border-radius: 16px;
        margin-right: 12px;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'
import { icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12, icon13, icon14, icon15, icon16, icon17, icon18 } from '@/data/iconBase64'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 260,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  menuItems: Array as () => MenuItem[]
})
const emit = defineEmits(['changeIcon'])

const iconList = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12, icon13, icon14, icon15, icon16, icon17, icon18]

const toChangeIcon = (val: string) => {
  emit('changeIcon', val)
}
</script>

<template>
  <el-popover
    popper-class="SelectIconPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <div class="header">
      <span>默认</span>
    </div>
    <div class="iconList">
      <span v-for="item in iconList" @click="toChangeIcon(item)"><img :src="item" /></span>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.SelectIconPopver {
  .header {
    height: 34px;
    border-bottom: 1px solid #e7e9e8;
    line-height: 32px;
    overflow: hidden;
    span {
      margin-left: 15px;
      font-size: 12px;
      transition: all 0.3s;
      display: inline-block;
      vertical-align: middle;
      color: #262626;
      cursor: pointer;
      font-weight: 700;
    }
  }
  .iconList {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;
    span {
      margin: 10px 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #eff0f0;
        outline: 3px solid #e7e9e8;
        border-radius: 4px;
      }
    }
    img {
      width: 26px;
      height: 26px;
    }
  }
}
</style>

<style lang="scss">
.SelectIconPopver {
  padding: 0px !important;
  min-width: 110px !important;
  border-radius: 8px !important;
}
</style>

<script lang="ts" setup>
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 138,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  menuItems: Array as () => MenuItem[]
})
</script>

<template>
  <el-popover
    popper-class="libraryOperationPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <ul>
      <template v-for="(item, _index) in props.menuItems" :key="'menuItems' + _index">
        <li class="operation_item" v-if="item.type === 'item'">
          <img v-if="item.icon" :src="item.icon as string" alt="" />
          <span :style="{ color: item.label === '删除' ? '#df2a3f' : '#262626' }">{{ item.label }}</span>
        </li>
        <li class="divider" v-else-if="item.type === 'divider'"></li>
      </template>
    </ul>
  </el-popover>
</template>

<style lang="scss" scoped>
.libraryOperationPopver {
  ul {
    list-style: none;
    .operation_item {
      box-sizing: border-box;
      padding: 6px 10px !important;
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      span {
        margin-left: 8px;
        font-size: 14px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
        cursor: pointer;
      }
    }
    .divider {
      margin: 4px 12px;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>

<style lang="scss">
.libraryOperationPopver {
  padding: 0 !important;
  min-width: 110px !important;
  border-radius: 8px !important;
}
</style>

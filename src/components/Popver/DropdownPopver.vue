<script lang="ts" setup>
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom',
  width: 214,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  menuItems: Array as () => MenuItem[],
  selectId: ''
})
const emit = defineEmits(['toChange'])

const DropdownPopverRef = ref<any>(null)

const toChange = (val) => {
  emit('toChange', val)
  DropdownPopverRef.value && DropdownPopverRef.value.hide()
}
</script>

<template>
  <el-popover
    ref="DropdownPopverRef"
    popper-class="DropdownPopver"
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
        <li class="dropdown_item" :class="[props.selectId === item.value ? 'selected' : '']" @click="toChange(item)">
          <div class="item">
            <div>
              <span>{{ item.label }}</span>
              <p>{{ item.desc }}</p>
            </div>
            <img v-if="props.selectId === item.value" src="/src/assets/icons/selectIcon.svg" alt="" />
          </div>
        </li>
      </template>
    </ul>
  </el-popover>
</template>

<style lang="scss" scoped>
.DropdownPopver {
  .dropdown_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 12px;
    color: #8a8f8d;
    box-sizing: border-box;
    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 14px;
        color: #585a5a;
      }
      p {
        font-size: 12px;
      }
    }
    &:hover {
      cursor: pointer;
      background-color: #eff0f0;
    }
  }
  .selected {
    background-color: #eff0f0;
  }
}
</style>

<style lang="scss">
.DropdownPopver {
  padding: 0px !important;
  padding-top: 4px !important;
  border-radius: 8px !important;
}
</style>

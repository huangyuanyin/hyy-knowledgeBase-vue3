<script lang="ts" setup>
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'right',
  width: 240,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  menuItems: Array as () => MenuItem[]
})

const route = useRoute()
const infoStore = useInfoStore()
const morePopverRef = ref(null)
const spaceName = ref('')

watchEffect(() => {
  spaceName.value = infoStore.currentSpaceType === '个人' ? '' : route.path.split('/')[1]
})

const toHandle = (item) => {
  morePopverRef.value && morePopverRef.value.hide()
  if (item.nick === 'toRecycle') {
    const query = {
      sid: infoStore.currentQuery?.sid,
      sname: infoStore.currentQuery?.sname
    }
    router.push({
      path: infoStore.currentSpaceType === '个人' ? '/recycles' : `/${spaceName.value}/recycles`,
      query: infoStore.currentSpaceType === '个人' ? null : { ...query }
    })
  }
}
</script>

<template>
  <el-popover
    popper-class="morePopver"
    ref="morePopverRef"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <header>更多</header>
    <ul>
      <template v-for="(item, _index) in props.menuItems" :key="'menuItems' + _index">
        <li class="operation_detail_item" v-if="item.type === 'detailItem'" @click="toHandle(item)">
          <img v-if="item.icon" :src="item.icon" alt="" />
          <div>
            <span>{{ item.label }}</span>
            <p>{{ item.desc }}</p>
          </div>
        </li>
        <li class="divider" v-else-if="item.type === 'divider'"></li>
        <li class="operation_item" v-if="item.type === 'item'">
          <span>{{ item.label }}</span>
        </li>
      </template>
    </ul>
  </el-popover>
</template>

<style lang="scss" scoped>
.morePopver {
  header {
    height: 40px;
    line-height: 40px;
    font-weight: 600;
    font-size: 14px;
    color: #000;
    padding: 0 18px;
  }
  ul {
    list-style: none;
    .operation_item {
      box-sizing: border-box;
      padding: 6px 10px !important;
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      span {
        margin-left: 8px;
        font-size: 14px;
        color: #262626;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
        cursor: pointer;
      }
    }
    .operation_detail_item {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      border-radius: 6px;
      img {
        height: 16px;
        width: 16px;
        text-align: center;
        margin-right: 16px;
        margin-left: 8px;
      }
      div {
        span {
          font-weight: 500;
          font-size: 12px;
          color: #262626;
          margin-top: -4px;
          height: 18px;
          line-height: 18px;
        }
        p {
          font-weight: 400;
          font-size: 12px;
          color: #585a5a;
          line-height: 20px;
        }
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
.morePopver {
  padding: 8px 8px 4px 8px !important;
  min-width: 110px !important;
  border-radius: 8px !important;
}
</style>

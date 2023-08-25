<script lang="ts" setup>
interface ModuleType {
  id: number
  icon: string
  title: string
  description: string
  rightIcon?: string
}

const props = defineProps({
  module: {
    type: Object as PropType<ModuleType>,
    required: true
  }
})
</script>

<template>
  <div class="ModuleItem-wrap">
    <div class="item-left">
      <img :src="props.module.icon" alt="" />
      <div class="item-content">
        <span class="content-title">{{ props.module.title }}</span>
        <span class="content-desc">{{ props.module.description }}</span>
      </div>
    </div>
    <div class="item-right" v-if="props.module.rightIcon">
      <img :src="props.module.rightIcon" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ModuleItem-wrap {
  align-items: center;
  height: 55px;
  min-width: 259px;
  margin-right: 12px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #e7e9e8;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  padding: 0 17px;
  box-sizing: border-box;
  &:hover {
    background-color: #fafafa;
  }
  .item-left {
    display: flex;
    align-items: center;
    .item-content {
      display: flex;
      flex-direction: column;
      .content-title {
        height: 20px;
        font-weight: 500;
        font-size: 14px;
        color: #262626;
      }
      .content-desc {
        height: 20px;
        font-weight: 400;
        font-size: 12px;
        color: #8a8f8d;
        line-height: 20px;
      }
    }
  }
  .item-right {
    img {
      margin-right: 0px;
      width: 14px;
      height: 14px;
    }
  }
  img {
    width: 22px;
    height: 22px;
    margin-right: 17px;
  }
}
</style>

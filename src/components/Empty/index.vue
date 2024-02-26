<script lang="ts" setup>
import cooperate from '@/assets/img/cooperate.png'
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  height: {
    type: String,
    default: '800px'
  },
  img: {
    type: String,
    default: cooperate
  }
})
</script>

<template>
  <div class="Empty-wrap" :style="{ height: props.height }">
    <div class="empty">
      <div class="empty-img">
        <img :src="props.img" alt="" />
      </div>
      <p>{{ props.text }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Empty-wrap {
  max-height: 800px;
  padding-top: 40px;
  padding-bottom: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  .empty {
    &-img {
      height: 110px;
      margin-bottom: 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 120px;
        height: 83.04px;
      }
    }
    p {
      color: #8a8f8d;
      font-size: 14px;
    }
  }
}
</style>

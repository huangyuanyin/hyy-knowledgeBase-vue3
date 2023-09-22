<template>
  <div class="Empty-wrap" :style="{ height: props.height }">
    <div class="empty">
      <div class="empty-img">
        <img src="@/assets/img/cooperate.png" alt="" />
      </div>
      <p>{{ props.text }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  height: {
    type: String,
    default: '800px'
  }
})
</script>

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
      width: 110px;
      height: 110px;
      padding: 15.28px 0 11.68px 12.83px;
      margin-bottom: 16px;
      box-sizing: border-box;
      img {
        width: 97.78px;
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

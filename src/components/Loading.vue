<script lang="ts" setup>
const props = defineProps({
  height: {
    type: String,
    default: '175px'
  },
  text: {
    type: String,
    default: '正在努力加载中...'
  }
})
</script>

<template>
  <div class="loading-container" :style="{ height: props.height }">
    <div class="scaling-dots">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <span mt-10px text="#663399">{{ props.text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @-webkit-keyframes scaling-dots {
    0%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40%,
    60% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes scaling-dots {
    0%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40%,
    60% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  .scaling-dots {
    display: grid;
    height: 10px;
    grid-gap: 5px;
    grid-template-columns: repeat(5, 10px);
  }
  .scaling-dots div {
    -webkit-animation: scaling-dots 1s infinite ease backwards;
    animation: scaling-dots 1s infinite ease backwards;
    background: #663399;
    border-radius: 100%;
    height: 10px;
    width: 10px;
  }
  .scaling-dots div:nth-child(1) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  .scaling-dots div:nth-child(2) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  .scaling-dots div:nth-child(3) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .scaling-dots div:nth-child(4) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  .scaling-dots div:nth-child(5) {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
}
</style>

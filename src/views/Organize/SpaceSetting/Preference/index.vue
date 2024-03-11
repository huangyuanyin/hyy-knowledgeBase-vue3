<template>
  <div class="Preference_wrap">
    <div class="header">
      <span>偏好设置</span>
    </div>
    <div class="box">
      <div class="item" v-for="(item, index) in preferenceOptions" :key="'preferenceOptions' + index">
        <div class="item-header">
          <span>{{ item.title }}</span>
        </div>
        <span class="desc">{{ item.desc }}</span>
        <div class="it">
          <div class="left">
            <p>{{ item.label }}</p>
          </div>
          <div class="right">
            <el-switch disabled v-model="item.value" size="large" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bec0bf" @change="toChangeStatus(item)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const preferenceOptions = ref([
  {
    title: '公共区设置',
    desc: '设置公共区为空间首页',
    label: '设置后，空间全员访问空间时，均会首先进入公共区页面',
    value: false
  },
  {
    title: '提醒设置',
    desc: '空间切换提示',
    label: '成员跳出本空间时进行弹窗提醒，增强空间安全性',
    value: false
  }
])

const toChangeStatus = (item) => {
  console.log(`output->item`, item)
  ElMessage.warning('暂不支持自定义')
}
</script>

<style lang="scss" scoped>
.Preference_wrap {
  margin: auto;
  max-width: 124vh;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    .item {
      border-bottom: 1px solid #f4f5f5;
      box-sizing: border-box;
      &-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        span {
          margin-bottom: 16px;
          font-size: 16px;
          color: #262626;
          line-height: 22px;
        }
      }
      .desc {
        color: #262626;
        font-size: 14px;
      }
      .it {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 28px;
        .left {
          display: flex;
          flex-direction: column;
          p {
            line-height: 22px;
            margin-top: 3px;
            font-size: 14px;
            color: #8a8f8d;
          }
        }
      }
    }
    .item:nth-child(2) {
      padding-top: 28px;
    }
  }
}
</style>

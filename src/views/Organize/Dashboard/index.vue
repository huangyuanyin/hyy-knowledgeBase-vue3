<script lang="ts" setup>
import { spaceStartBox } from '@/data/data'

const route = useRoute()

const toLink = (val) => {
  router.push({
    path: `/${route.path.split('/')[1]}/organize${val.url}`,
    query: route.query
  })
}
</script>

<template>
  <div class="O-Dashboard_wrap">
    <div class="header">空间概览</div>
    <div class="start-box">
      <span>开始</span>
      <div class="itemList">
        <div class="item" v-for="(item, index) in spaceStartBox" :key="'spaceStartBox' + index" @click="toLink(item)">
          <a>
            <span>{{ item.title }}</span>
            <p>{{ item.description }}</p>
          </a>
        </div>
      </div>
    </div>
    <div class="detail-box">
      <span>使用情况</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.O-Dashboard_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
  }
  .start-box {
    margin-top: 24px;
    span {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      font-weight: 500;
    }
    .itemList {
      margin-left: -12px;
      margin-right: -12px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      flex-flow: row wrap;
      .item {
        padding-left: 12px;
        padding-right: 12px;
        box-sizing: border-box;
        max-width: 25%;
        a {
          box-sizing: border-box;
          padding: 32px 16px;
          position: relative;
          cursor: pointer;
          display: block;
          border: 1px solid rgba(231, 233, 232, 0.7);
          border-radius: 8px;
          background: url(https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*BwfBQr8gWVIAAAAAAAAAAAAADvuFAQ/original) no-repeat;
          background-size: cover;
          span {
            width: 218px;
            position: relative;
            font-size: 16px;
            color: #262626;
            display: block;
            line-height: 25px;
          }
          p {
            width: 218px;
            position: relative;
            margin-top: 10px;
            color: #585a5a;
            z-index: 999;
            font-size: 14px;
            line-height: 22px;
          }
          &:hover {
            box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.13), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 12px 24px 16px rgba(0, 0, 0, 0.04);
          }
        }
      }
    }
  }
  .detail-box {
    margin-top: 48px;
    span {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      font-weight: 500;
    }
  }
}
</style>

<script lang="ts" setup>
const route = useRoute()
const name = ref('')
const itemList = [
  {
    label: '收藏',
    icon: '/src/assets/icons/article/starIcon.svg'
  },
  {
    label: '协作',
    icon: '/src/assets/icons/article/collaborateIcon.svg'
  },
  {
    label: '演示',
    icon: '/src/assets/icons/article/presentIcon.svg'
  }
]
const buttonList = [
  {
    label: '分享',
    type: 'default'
  },
  {
    label: '编辑',
    type: 'success'
  }
]

watchEffect(() => {
  if (route.query.aname) {
    name.value = route.query.aname as string
  }
})
</script>

<template>
  <div class="Doc_wrap">
    <el-container>
      <el-header class="Header_wrap">
        <div class="left">
          <label>{{ name }}</label>
          <span>
            <img src="/src/assets/icons/publicIcon.svg" alt="" />
          </span>
        </div>
        <div class="right">
          <div class="item" v-for="(item, index) in itemList" :key="'itemList' + index">
            <el-tooltip effect="dark" :content="item.label" placement="bottom" :show-arrow="false">
              <span>
                <img :src="item.icon" alt="" />
              </span>
            </el-tooltip>
          </div>
          <div class="button" v-for="(item, index) in buttonList" :key="'itemList' + index">
            <el-button :type="item.type">{{ item.label }}</el-button>
          </div>
          <div class="action">
            <span><img src="/src/assets/icons/article/commentIcon.svg" alt="" /></span>
            <span><img src="/src/assets/icons/article/rightboardIcon.svg" alt="" /></span>
          </div>
        </div>
      </el-header>
      <el-main class="body"> 这是一篇类型为富文本的文章：{{ route.query.aid }} </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.Header_wrap {
  height: 52px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    label {
      color: #585a5a;
    }
    span {
      margin-left: 5px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .item {
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        &:hover {
          background-color: #eff0f0;
        }
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .button {
      margin-left: 8px;
      .el-button {
        border-radius: 6px;
      }
    }
    .action {
      position: relative;
      width: 64px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #d8dad9;
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px;
      box-sizing: border-box;
      span {
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        img {
          width: 16px;
          height: 16px;
        }
        &:hover {
          background-color: #eff0f0;
        }
      }
    }
  }
}
.body {
  width: 100%;
  margin-top: 30px;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>

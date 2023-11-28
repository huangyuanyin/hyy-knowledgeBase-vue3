<script lang="ts" setup>
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || '@/assets/img/img.jpg')
const nickname = JSON.parse(localStorage.getItem('userInfo')).nickname || ''

const toExit = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  localStorage.removeItem('personalSpaceInfo')
  localStorage.removeItem('personalGroupId')
  localStorage.setItem('isAuth', 'false')
  sessionStorage.clear()
  router.push('/login')
}

const toSetting = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}

const toUserInfo = () => {
  ElMessage.warning('功能暂未开放，敬请期待')
}
</script>

<template>
  <el-popover popper-class="userPopver" placement="bottom-start" :width="305" :hide-after="100" :show-arrow="false" trigger="hover">
    <template #reference>
      <slot>
        <span class="sidebar-top-right-headimg">
          <img :src="avatar" />
        </span>
      </slot>
    </template>
    <div class="sidebar-top-right-userPopver">
      <div class="sidebar-top-right-userPopver-content">
        <ul class="sidebar-top-right-userPopver-content-list">
          <li class="sidebar-top-right-userPopver-content-list-item user-item">
            <div class="sidebar-top-right-userPopver-content-list-item-header">
              <img :src="avatar" />
              <span class="sidebar-top-right-userPopver-top-name">{{ nickname }}</span>
            </div>
          </li>
          <li class="sidebar-top-right-userPopver-content-list-line"></li>
          <li class="sidebar-top-right-userPopver-content-list-item" @click="toUserInfo">
            <div class="sidebar-top-right-userPopver-content-list-item-li">
              <svg-icon iconName="icon-gerenzhongxin" className="gerenzhongxin_svg"></svg-icon>
              <span>个人中心</span>
            </div>
          </li>
          <li class="sidebar-top-right-userPopver-content-list-item" @click="toSetting">
            <div class="sidebar-top-right-userPopver-content-list-item-li">
              <svg-icon iconName="icon-shezhi" className="shezhi_svg"></svg-icon>
              <span>账户设置</span>
            </div>
          </li>
          <li class="sidebar-top-right-userPopver-content-list-line"></li>
          <li class="sidebar-top-right-userPopver-content-list-item" @click="toExit">
            <div class="sidebar-top-right-userPopver-content-list-item-li">
              <svg-icon iconName="icon-tuichu" className="tuichu_svg"></svg-icon>
              <span>退出登录</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.sidebar-top-right-headimg {
  height: 30px;
  width: 30px;
  line-height: 30px;
  border-radius: 6px;
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #eff0f0;
    cursor: pointer;
  }
  img {
    width: 24px;
    min-width: 24px;
    height: 24px;
    border-radius: 12px;
  }
}
.userPopver {
  .sidebar-top-right-userPopver {
    box-sizing: border-box;
    width: 100%;
    &-top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-right: 10px;
      }
      &-name {
        font-size: 16px;
        font-weight: 700;
        color: #262626;
      }
    }
    &-content {
      &-list {
        list-style: none;
        &-item {
          display: flex;
          align-items: center;
          height: 40px;
          line-height: 40px;
          border-radius: 6px;
          padding: 0px 10px;
          &-header {
            display: flex;
            align-items: center;
            img {
              width: 40px;
              height: 40px;
              border-radius: 20px;
              margin-right: 10px;
            }
            span {
              font-size: 16px;
              font-weight: 700;
              color: #262626;
            }
          }
          &-li {
            margin: 4px 6px;
            border-radius: 6px;
            color: #262626;
            svg {
              width: 16px;
              height: 16px;
            }
            span {
              margin-left: 8px;
            }
          }
          &:hover {
            cursor: pointer;
            background-color: #eff0f0;
          }
        }
        &-line {
          height: 1px;
          margin: 6px 12px;
          background-color: rgba(0, 0, 0, 0.04);
        }
        .user-item {
          padding: 6px 16px 8px;
          &:hover {
            cursor: text;
            background-color: #ffff !important;
          }
        }
      }
    }
    &-bottom {
      &-item {
        display: flex;
        align-items: center;
        padding: 8px 5px;
        &:hover {
          cursor: pointer;
          background-color: #eff0f0;
        }
        svg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          font-weight: 400;
          color: #262626;
        }
      }
    }
  }
}
</style>
